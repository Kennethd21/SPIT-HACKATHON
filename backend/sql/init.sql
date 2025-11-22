CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  uom TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS warehouses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_stock (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  quantity BIGINT DEFAULT 0,
  reserved BIGINT DEFAULT 0,
  last_counted_at TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_product_stock_product_warehouse ON product_stock(product_id, warehouse_id);

CREATE TABLE IF NOT EXISTS receipts (
  id SERIAL PRIMARY KEY,
  reference TEXT,
  supplier TEXT,
  status TEXT CHECK (status IN ('draft','validated','cancelled')) DEFAULT 'draft',
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receipt_lines (
  id SERIAL PRIMARY KEY,
  receipt_id INT REFERENCES receipts(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  qty_expected BIGINT,
  qty_received BIGINT
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  reference TEXT,
  customer TEXT,
  status TEXT CHECK (status IN ('pending','picked','delivered')) DEFAULT 'pending',
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS delivery_lines (
  id SERIAL PRIMARY KEY,
  delivery_id INT REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  qty_delivered BIGINT
);

CREATE TABLE IF NOT EXISTS adjustments (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  counted_qty BIGINT,
  diff BIGINT,
  reason TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_ledger (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  change_qty BIGINT,
  balance_after BIGINT,
  reference_type TEXT,
  reference_id INT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT now()
);