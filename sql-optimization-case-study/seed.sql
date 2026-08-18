-- =============================================================================
-- Seed — generates dummy data (no real/production data).
--   stores:   50
--   products: 300
--   sales:    1,000,000 rows over 2024-01-01 .. 2025-12-31
--
-- Data is generated in-database with generate_series() + random() so it stays
-- reproducible and reasonably realistic in distribution.
-- =============================================================================

INSERT INTO stores (name, area, opened_at)
SELECT
  '店舗' || g,
  (ARRAY['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州'])[1 + floor(random() * 8)],
  DATE '2015-01-01' + (floor(random() * 3000))::int
FROM generate_series(1, 50) AS g;

INSERT INTO products (name, category, price)
SELECT
  '商品' || g,
  (ARRAY['食品', '日用品', '家電', '衣料', '雑貨'])[1 + floor(random() * 5)],
  (100 + floor(random() * 9900))::numeric
FROM generate_series(1, 300) AS g;

-- 1,000,000 sales rows. Each generated row is joined to a randomly chosen
-- product (hash join) so unit_price is consistent with the product's price.
INSERT INTO sales (store_id, product_id, quantity, unit_price, sold_at)
SELECT
  (1 + floor(random() * 50))::int,
  s.pid,
  (1 + floor(random() * 10))::int,
  pr.price,
  TIMESTAMP '2024-01-01' + (random() * INTERVAL '730 days')
FROM (
  SELECT (1 + floor(random() * 300))::int AS pid
  FROM generate_series(1, 1000000)
) AS s
JOIN products pr ON pr.id = s.pid;

ANALYZE;
