# Benchmark — Before / After

> すべて**公開可能なダミーデータ**で計測。前職の実データ・実テーブル・実クエリは一切含みません。

## 計測環境

| 項目 | 値 |
|------|-----|
| DBMS | PostgreSQL 15.13 (Homebrew, aarch64-apple-darwin) ※ `docker-compose.yml` は再現用に PostgreSQL 16 を起動 |
| データ量 | stores 50 / products 300 / **sales 1,000,000 行**（2024-01-01〜2025-12-31） |
| クエリ | 1店舗の月別売上＋前年同月比（ダッシュボードのドリルダウン相当） |
| 実行条件 | 1リクエスト＝1クエリを想定し `max_parallel_workers_per_gather = 0`（並列なし）で計測。ウォームキャッシュ。 |
| 対象店舗 | `store_id = 7`（該当行 20,063 / 全 1,000,000 行） |

`EXPLAIN (ANALYZE, BUFFERS)` を各6回実行した代表値（中央値近傍）を採用。実行時間は環境ノイズで変動するため範囲も併記。

## 結果サマリ

| | Before（インデックスなし） | After（複合カバリングインデックス） |
|---|---|---|
| スキャン方式 | **Seq Scan** | **Index Only Scan**（Heap Fetches: 0） |
| 読み取り行数 | 1,000,000 走査 → 20,063 一致（979,937 を Filter で除外） | 20,063 のみ |
| 共有バッファ | shared hit ≈ 8,334（≈ 65 MB） | shared hit ≈ 128（≈ 1 MB） |
| 実行時間（代表値） | **≈ 95 ms** | **≈ 12 ms** |
| 実行時間（6回の範囲） | 95〜164 ms | 11〜19 ms |
| **高速化** | — | **≈ 7.8×**（95 / 12） |

> テーブル 65 MB に対し、追加インデックス `idx_sales_store_sold` は 47 MB。書き込み時のコストと引き換えに、対象店舗の行だけを読むインデックスオンリースキャンへ変わり、走査量が 1,000,000 → 20,063 行（約 1/50）に減少した。

## Before — `EXPLAIN (ANALYZE, BUFFERS)`

```
 GroupAggregate  (cost=27530.44..28520.26 rows=21996 width=68) (actual time=90.697..95.363 rows=12 loops=1)
   Group Key: ((EXTRACT(month FROM sold_at))::integer)
   Buffers: shared hit=8337
   ->  Sort  (cost=27530.44..27585.43 rows=21996 width=21) (actual time=90.163..91.198 rows=20063 loops=1)
         Sort Key: ((EXTRACT(month FROM sold_at))::integer)
         Sort Method: quicksort  Memory: 2022kB
         Buffers: shared hit=8337
         ->  Seq Scan on sales  (cost=0.00..25943.98 rows=21996 width=21) (actual time=0.019..87.768 rows=20063 loops=1)
               Filter: ((sold_at >= '2024-01-01'::date) AND (sold_at < '2026-01-01'::date) AND (store_id = 7))
               Rows Removed by Filter: 979937
               Buffers: shared hit=8334
 Planning Time: 0.782 ms
 Execution Time: 95.405 ms
```

## After — `EXPLAIN (ANALYZE, BUFFERS)`（`idx_sales_store_sold` 追加後）

```
 GroupAggregate  (cost=2727.77..3717.59 rows=21996 width=68) (actual time=7.516..12.104 rows=12 loops=1)
   Group Key: ((EXTRACT(month FROM sold_at))::integer)
   Buffers: shared hit=131
   ->  Sort  (cost=2727.77..2782.76 rows=21996 width=21) (actual time=7.085..7.742 rows=20063 loops=1)
         Sort Key: ((EXTRACT(month FROM sold_at))::integer)
         Sort Method: quicksort  Memory: 2022kB
         Buffers: shared hit=131
         ->  Index Only Scan using idx_sales_store_sold on sales  (cost=0.42..1141.32 rows=21996 width=21) (actual time=0.792..5.057 rows=20063 loops=1)
               Index Cond: ((store_id = 7) AND (sold_at >= '2024-01-01'::date) AND (sold_at < '2026-01-01'::date))
               Heap Fetches: 0
               Buffers: shared hit=128
 Planning Time: 0.366 ms
 Execution Time: 12.157 ms
```

## 補足：並列実行を許可した場合

デフォルト設定（並列あり）では Before が Parallel Seq Scan（2ワーカー）となり ≈ 35 ms まで下がるため、対 After（≈ 11 ms）で約 3×。上記は「1リクエスト＝1クエリ」を想定した並列なしの数値。どちらの条件でも **Seq Scan → Index Only Scan** への変化と走査量の削減という本質は同じ。

## 前職の実績との関係

前職では、より大規模かつディスク I/O が支配的なデータに対して同じ手法（複合＋カバリングインデックスで全件走査を排除）を適用し、約 6 秒 → 約 0.1 秒（**約 60×**）の改善を得た。本ベンチはその**手法**を、公開可能なダミーデータ・小規模・インメモリ条件で再現・計測したもの。条件が異なるため倍率（≈ 7.8×）は一致しないが、ボトルネックの特定から設計・検証までの流れは同一。
