-- =============================================================================
-- AFTER — identical query, now with idx_sales_store_sold present.
--
-- PostgreSQL uses an index-only scan on (store_id, sold_at) INCLUDE (...),
-- reading only the ~20,000 rows for this store instead of scanning 1,000,000.
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
