# Regras para Copiar Estrutura de Código

## Quando o usuário pedir para "analisar e fazer igual" ou "copiar estrutura"

### Processo Obrigatório

1. **LER TODOS OS ARQUIVOS** do exemplo (latest E v1)
   - Não assuma nada baseado apenas nas rules gerais
   - Leia cada tipo de arquivo: controller, service, model, schema, routes
   - Compare latest vs v1 para identificar diferenças

2. **IDENTIFICAR PADRÕES REAIS**
   - Quais arquivos fazem re-export simples?
   - Quais arquivos têm estrutura diferente entre latest e v1?
   - Quais imports são usados?
   - Qual a estrutura de cada função?
   - Quais validações são aplicadas?

3. **REPLICAR EXATAMENTE**
   - Mantenha a mesma estrutura de código
   - Use os mesmos imports
   - Siga o mesmo padrão de validações
   - Preserve a mesma organização de funções
   - Copie o estilo de nomenclatura

4. **VERIFICAR ANTES DE CRIAR**
   - Confirme que entendeu todas as diferenças
   - Liste mentalmente o que será criado
   - Garanta que cada arquivo segue o padrão correto

## Exemplos de Diferenças Importantes

### Arquivos .routes.ts
- **Latest**: Define rotas com MagicRouter e prefix do recurso
- **V1**: Cria router com prefix `/v1` e usa router do latest

```typescript
// latest/accounts.routes.ts
export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  // ... define rotas
  return router;
};

// v1/accounts.routes.ts
export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/v1' });
  const accountsRouter = await accounts.initialize();
  router.useMagic(accountsRouter);
  return router;
};
```

### Outros arquivos (controller, service, model, schema)
- **Latest**: Implementação completa
- **V1**: Re-export simples do latest

```typescript
// v1/account.service.ts
export * from '@/domains/realms/accounts/latest/account.service';
```

## Checklist de Verificação

Antes de criar arquivos, confirme:

- [ ] Li TODOS os arquivos do exemplo (latest E v1)?
- [ ] Identifiquei as diferenças entre latest e v1?
- [ ] Entendi qual padrão cada tipo de arquivo segue?
- [ ] Sei quais arquivos fazem re-export e quais não?
- [ ] Verifiquei imports e dependências?
- [ ] Confirmei estrutura de validações?

## Princípio Fundamental

**CÓDIGO REAL > RULES GERAIS**

Quando houver conflito entre o que as rules dizem e o que o código de exemplo mostra, SEMPRE siga o código de exemplo.

As rules são guias gerais, mas o código existente é a fonte da verdade do projeto.
