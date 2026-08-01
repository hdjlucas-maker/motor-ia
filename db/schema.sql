-- Motor IA — schema do banco D1
-- Rodar com: npx wrangler d1 execute motor-ia-db --remote --file=./db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  cpf_hash TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vehicles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  type TEXT DEFAULT 'carro',
  brand TEXT,
  model TEXT,
  year TEXT,
  current_km INTEGER DEFAULT 0,
  fuel_type TEXT,
  category TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  date TEXT NOT NULL,        -- 'YYYY-MM-DD'
  type TEXT NOT NULL,        -- 'ganho' ou 'gasto'
  category TEXT,             -- ex: 'gnv', 'mecanico', 'manutencao', 'casa', 'reserva'
  amount REAL NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);

CREATE TABLE IF NOT EXISTS debts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  installment_value REAL,
  installments_total INTEGER,
  installments_paid INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativa'
);

CREATE TABLE IF NOT EXISTS fixed_bills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  amount REAL,
  due_day INTEGER,
  paid_month TEXT   -- ex: '2026-08' marca que o mês de agosto já foi pago
);
