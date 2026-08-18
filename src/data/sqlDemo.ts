// =============================================================================
// SQL最適化 Before/After デモのデータ。
//
// ここに載る数値・実行計画は、すべて sql-optimization-case-study/ の
// 公開ダミーデータ（sales 100万行）を PostgreSQL でローカル計測した「実測値」。
// 捏造ではなく、benchmark.md に対応する。前職の実データ・実クエリは含まない。
//
// A-(2)（PGlite でブラウザ内実行）に差し替える場合は、この構造を満たす値を
// 実行結果から生成すれば、コンポーネント側は変更なしで描画できる。
// =============================================================================

export type Plan = {
  /** ボタン/カラムのラベル */
  label: string
  /** スキャン方式（Seq Scan / Index Only Scan など） */
  scanMethod: string
  /** 実行時間（ms・代表値、実測） */
  executionMs: number
  /** 実際に走査した行数 */
  rowsScanned: number
  /** 条件に一致した行数 */
  rowsMatched: number
  /** 共有バッファのヒット数（読み取り量の目安） */
  sharedBuffers: number
  /** EXPLAIN (ANALYZE, BUFFERS) の要約 */
  explain: string
}

export type SqlDemo = {
  dataset: string
  environment: string
  query: string
  indexSql: string
  before: Plan
  after: Plan
  /** 本番実績（別条件）。デモの実測値とは分けて表示する */
  productionNote: string
  repoUrl: string
}

export const sqlDemo: SqlDemo = {
  dataset: 'ダミーデータ：stores 50 / products 300 / sales 1,000,000 行（2024–2025）',
  environment:
    'PostgreSQL 15 / 1リクエスト＝1クエリ（並列なし）/ ウォームキャッシュ。対象は store_id=7（該当 20,063 行）',
  query: `SELECT
  EXTRACT(MONTH FROM sold_at)::int AS month,
  SUM(quantity * unit_price)
    FILTER (WHERE sold_at >= DATE '2025-01-01') AS revenue_current,
  SUM(quantity * unit_price)
    FILTER (WHERE sold_at <  DATE '2025-01-01') AS revenue_prev
FROM sales
WHERE store_id = 7
  AND sold_at >= DATE '2024-01-01'
  AND sold_at <  DATE '2026-01-01'
GROUP BY 1
ORDER BY 1;`,
  indexSql: `CREATE INDEX idx_sales_store_sold
  ON sales (store_id, sold_at)
  INCLUDE (quantity, unit_price);`,
  before: {
    label: 'Before（インデックスなし）',
    scanMethod: 'Seq Scan',
    executionMs: 95,
    rowsScanned: 1_000_000,
    rowsMatched: 20_063,
    sharedBuffers: 8_334,
    explain: `Seq Scan on sales
  (actual time=0.019..87.768 rows=20063 loops=1)
  Filter: (store_id = 7 AND sold_at >= '2024-01-01' AND sold_at < '2026-01-01')
  Rows Removed by Filter: 979937
  Buffers: shared hit=8334
Execution Time: 95.405 ms`,
  },
  after: {
    label: 'After（複合カバリングインデックス）',
    scanMethod: 'Index Only Scan',
    executionMs: 12,
    rowsScanned: 20_063,
    rowsMatched: 20_063,
    sharedBuffers: 128,
    explain: `Index Only Scan using idx_sales_store_sold on sales
  (actual time=0.792..5.057 rows=20063 loops=1)
  Index Cond: (store_id = 7 AND sold_at >= '2024-01-01' AND sold_at < '2026-01-01')
  Heap Fetches: 0
  Buffers: shared hit=128
Execution Time: 12.157 ms`,
  },
  productionNote:
    '前職では、より大規模でディスクI/Oが支配的なデータに同じ手法を適用し、約6秒→約0.1秒（約60倍）を達成。本デモはその手法を公開可能なダミーデータで再現・計測したもので、条件が異なるため倍率は一致しません。',
  repoUrl: 'https://github.com/koutadev/portfolio/tree/main/sql-optimization-case-study',
}
