-- =============================================================================
-- BEFORE — no supporting index on sales(store_id, sold_at).
--
-- Dashboard drill-down: one store's monthly revenue for the current year with
-- the prior-year figure for each month (前年同月比). Because there is no index
-- covering the (store_id, sold_at) filter, PostgreSQL must Seq Scan the whole
-- sales table (~1,000,000 rows) to find the ~20,000 rows for this store.
-- =============================================================================

EXPLAIN (ANALYZE, BUFFERS)
SELECT
  EXTRACT(MONTH FROM sold_at)::int                                      AS month,
  SUM(quantity * unit_price) FILTER (WHERE sold_at >= DATE '2025-01-01') AS revenue_current,
  SUM(quantity * unit_price) FILTER (WHERE sold_at <  DATE '2025-01-01') AS revenue_prev
FROM sales
WHERE store_id = 7
  AND sold_at >= DATE '2024-01-01'
  AND sold_at <  DATE '2026-01-01'
GROUP BY 1
ORDER BY 1;
