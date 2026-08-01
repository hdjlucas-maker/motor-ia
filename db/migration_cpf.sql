-- Migração: adiciona controle de CPF pra impedir múltiplos períodos de teste grátis
-- Rodar com:
--   npx wrangler d1 execute motor-ia-db --remote --file=./db/migration_cpf.sql
--   npx wrangler d1 execute motor-ia-db --local --file=./db/migration_cpf.sql

ALTER TABLE users ADD COLUMN cpf_hash TEXT;

-- Índice único: garante no banco que o mesmo CPF nunca crie uma segunda conta,
-- mesmo que algum bug no código deixe passar.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cpf_hash ON users(cpf_hash);
