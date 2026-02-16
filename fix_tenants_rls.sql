-- Ativar RLS na tabela tenants (caso não esteja ativa)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas para evitar duplicados
DROP POLICY IF EXISTS "Permitir leitura para todos" ON tenants;
DROP POLICY IF EXISTS "Permitir leitura para autenticados" ON tenants;
DROP POLICY IF EXISTS "Permitir insert para autenticados" ON tenants;
DROP POLICY IF EXISTS "Permitir update para autenticados" ON tenants;
DROP POLICY IF EXISTS "Permitir delete para autenticados" ON tenants;

-- Criar política de LEITURA (SELECT) para utilizadores autenticados
CREATE POLICY "Permitir leitura para autenticados" 
ON tenants FOR SELECT 
TO authenticated 
USING (true);

-- Criar política de CRIAÇÃO (INSERT) para utilizadores autenticados
CREATE POLICY "Permitir insert para autenticados" 
ON tenants FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Criar política de ATUALIZAÇÃO (UPDATE) para utilizadores autenticados
-- Isto permite que qualquer utilizador logado atualize qualquer tenant.
-- Numa versão final, deve restringir apenas a admins.
CREATE POLICY "Permitir update para autenticados" 
ON tenants FOR UPDATE 
TO authenticated 
USING (true);

-- Criar política de REMOÇÃO (DELETE) para utilizadores autenticados
CREATE POLICY "Permitir delete para autenticados" 
ON tenants FOR DELETE 
TO authenticated 
USING (true);
