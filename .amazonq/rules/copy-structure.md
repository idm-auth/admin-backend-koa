# Regras para Copiar Estrutura de Código

## Quando o usuário pedir para "analisar e fazer igual" ou "copiar estrutura"

### Processo Obrigatório

1. **LER TODOS OS ARQUIVOS** do exemplo
   - Não assuma nada baseado apenas nas rules gerais
   - Leia cada tipo de arquivo: controller, service, model, schema, routes
   - Analise a estrutura atual do domínio

2. **IDENTIFICAR PADRÕES REAIS**
   - Qual a estrutura de cada arquivo?
   - Quais imports são usados?
   - Qual a estrutura de cada função?
   - Quais validações são aplicadas?
   - Como as rotas são organizadas?

3. **REPLICAR EXATAMENTE**
   - Mantenha a mesma estrutura de código
   - Use os mesmos imports
   - Siga o mesmo padrão de validações
   - Preserve a mesma organização de funções
   - Copie o estilo de nomenclatura

4. **VERIFICAR ANTES DE CRIAR**
   - Confirme que entendeu a estrutura
   - Liste mentalmente o que será criado
   - Garanta que cada arquivo segue o padrão correto

## Estrutura Atual dos Domínios

### Arquivos .routes.ts
- Define rotas com MagicRouter e prefix do recurso
- Implementação direta sem camadas de compatibilidade

```typescript
// accounts.routes.ts
export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  // ... define rotas
  return router;
};
```

### Outros arquivos (controller, service, model, schema)
- Implementação direta na raiz do domínio
- Sem estruturas de re-export

```typescript
// account.service.ts
export const create = async (tenantId: string, data: AccountCreate) => {
  // implementação direta
};
```

## Checklist de Verificação

Antes de criar arquivos, confirme:

- [ ] Li TODOS os arquivos do exemplo?
- [ ] Identifiquei a estrutura atual do domínio?
- [ ] Entendi qual padrão cada tipo de arquivo segue?
- [ ] Verifiquei imports e dependências?
- [ ] Confirmei estrutura de validações?
- [ ] Entendi como as rotas são organizadas?

## Princípio Fundamental

**CÓDIGO REAL > RULES GERAIS**

Quando houver conflito entre o que as rules dizem e o que o código de exemplo mostra, SEMPRE siga o código de exemplo.

As rules são guias gerais, mas o código existente é a fonte da verdade do projeto.
