-- Corrigir a tabela 'tenants' adicionando as colunas em falta

-- 1. Adicionar coluna logo_url (se não existir)
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- 2. Adicionar coluna theme (se não existir) como JSONB
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"primaryColor": "#0f172a", "secondaryColor": "#3b82f6"}'::jsonb;

-- 3. Atualizar registos antigos que possam ter theme a NULL
UPDATE tenants 
SET theme = '{"primaryColor": "#0f172a", "secondaryColor": "#3b82f6"}'::jsonb 
WHERE theme IS NULL;
