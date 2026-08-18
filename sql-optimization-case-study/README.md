# SQL最適化ケーススタディ — Seq Scan → Index Only Scan

複数店舗を持つ小売チェーンの売上集計を題材に、**インデックス設計で全件走査を排除し、ダッシュボードのドリルダウンを高速化する**過程を、手元で再現・計測できるようにまとめたものです。

> **守秘について**：本リポジトリは前職の実データ・実テーブル・実クエリを一切含みません。ドメイン（小売チェーンの売上集計）・スキーマ・データはすべて公開可能なダミーとして新規に作成し、`generate_series()` + `random()` で生成しています。ポートフォリオの実務ケーススタディで触れた「約60倍の高速化」と**同じ手法**を、公開できる形で再現・計測することが目的です。

## 構成

```
sql-optimization-case-study/
├── docker-compose.yml     # PostgreSQL 16 を起動（再現用）
├── schema.sql             # stores / products / sales
├── seed.sql               # ダミーデータ生成（sales 100万行）
├── queries/
│   ├── 01_before.sql      # 遅いクエリ + EXPLAIN (ANALYZE, BUFFERS)
│   ├── 02_indexes.sql     # 複合カバリングインデックス
│   └── 03_after.sql       # 改善後クエリ + EXPLAIN (ANALYZE, BUFFERS)
├── run.sh                 # 一括実行スクリプト
├── benchmark.md           # 計測結果（実測値・実行計画）
└── README.md
```

## 再現手順

### Docker（PostgreSQL 16）

```bash
docker compose up -d          # 起動時に schema.sql / seed.sql を自動投入
# 100万行の生成が終わるまで少し待つ（ログで確認）
docker compose logs -f db

# 計測
docker compose exec -T db psql -U demo -d sqldemo -f - < queries/01_before.sql
docker compose exec -T db psql -U demo -d sqldemo -f - < queries/02_indexes.sql
docker compose exec -T db psql -U demo -d sqldemo -f - < queries/03_after.sql

docker compose down -v        # 後片付け
```

### ローカルの psql（任意）

```bash
./run.sh                      # 一時クラスタを作って schema→seed→before→index→after を実行
```

## ストーリー

### 1. 課題
本番稼働中の売上集計ダッシュボードで、ある店舗の月別売上（前年同月比つき）を表示する際に体感数秒の待ちが発生。主な利用者は決裁層で、待ち時間が確認作業の妨げになっていた。

### 2. 計測（Before）
`EXPLAIN (ANALYZE, BUFFERS)` で確認すると、`sales`（100万行）に対する **Seq Scan**。対象は 1 店舗の約 2 万行だけなのに、979,937 行を読んでから `Filter` で捨てていた。→ 走査量が支配的。

### 3. アプローチ / 設計判断
フィルタ列 `(store_id, sold_at)` を**複合インデックスのキー**に、集計に使う `quantity, unit_price` を **`INCLUDE`（カバリング）** に置く。こうすると、ヒープに触れずインデックスだけで応答できる **Index Only Scan**（`Heap Fetches: 0`）になり、対象店舗の行だけを読む。

```sql
CREATE INDEX idx_sales_store_sold
  ON sales (store_id, sold_at)
  INCLUDE (quantity, unit_price);
```

- なぜ複合か：`store_id` 等値 + `sold_at` 範囲、という典型パターンに一致させるため（等値列を先頭、範囲列を後ろ）。
- なぜ `INCLUDE` か：`SELECT`/集計で必要な列を載せて heap fetch を無くし、Index **Only** Scan に落とすため。
- トレードオフ：インデックス 47 MB 分のストレージと、書き込み時のメンテナンスコストが増える。読み取り主体のダッシュボード用途では見合う。

### 4. 計測（After）
同じクエリが **Index Only Scan** に変化。走査は 20,063 行、共有バッファは 8,334 → 128 に激減。

### 5. Before / After 比較

| | Before | After |
|---|---|---|
| スキャン | Seq Scan | Index Only Scan（Heap Fetches: 0） |
| 読み取り行 | 1,000,000 → 20,063 一致 | 20,063 |
| 実行時間（代表値） | ≈ 95 ms | ≈ 12 ms |
| 高速化 | — | **≈ 7.8×** |

詳細な実行計画は [`benchmark.md`](./benchmark.md) を参照。

### 6. 学び
- 「遅い」は主観。まず `EXPLAIN (ANALYZE, BUFFERS)` で**走査量とスキャン方式**を数値で見る。
- `INCLUDE` を使ったカバリングインデックスは、集計系の読み取りクエリで heap fetch を消せる強力な選択肢。
- インデックスは無料ではない（容量・書き込みコスト）。用途（読み取り主体か）を見て採否を判断する。
- 計測条件（並列の有無・キャッシュ・データ量）で倍率は変わる。だからこそ**環境と条件を明記**して再現可能にする。
