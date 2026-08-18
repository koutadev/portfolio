-- =============================================================================
-- Schema — SQL optimization case study (dummy retail-chain sales)
--
-- NOTE (守秘): This uses ONLY publicly-shareable dummy data. No real tables,
-- data, or queries from any employer/client are included. The domain is a
-- generic "multi-store retail chain sales aggregation".
-- =============================================================================

DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS stores;

-- Dozens of stores
CREATE TABLE stores (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  area       TEXT NOT NULL,
  opened_at  DATE NOT NULL
);

-- Hundreds of products
CREATE TABLE products (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  category  TEXT NOT NULL,
  price     NUMERIC(10, 2) NOT NULL
);

-- 500k–1M sales rows (see seed.sql)
CREATE TABLE sales (
  id          BIGSERIAL PRIMARY KEY,
  store_id    INT NOT NULL REFERENCES stores(id),
  product_id  INT NOT NULL REFERENCES products(id),
  quantity    INT NOT NULL,
  unit_price  NUMERIC(10, 2) NOT NULL,
  sold_at     TIMESTAMP NOT NULL
);
