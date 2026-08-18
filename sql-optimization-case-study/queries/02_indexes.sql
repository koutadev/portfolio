-- =============================================================================
-- INDEX — covering composite index.
--
-- The filter is on (store_id, sold_at); the aggregation needs quantity and
-- unit_price. By putting the filter columns in the key and the aggregated
-- columns in INCLUDE, the query can be answered by an index-only scan — it
-- reads only this store's rows and never touches the heap.
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_sales_store_sold
  ON sales (store_id, sold_at)
  INCLUDE (quantity, unit_price);

ANALYZE sales;
