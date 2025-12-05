# TODO no Código - IA Rules

## TRIGGERS AUTOMÁTICOS - TODO

### SE identificando funcionalidade incompleta
→ **ENTÃO** adicione TODO no código, NUNCA apenas mencione

### SE encontrando código que precisa melhorias futuras
→ **ENTÃO** adicione TODO com descrição clara

### SE implementando parcialmente uma feature
→ **ENTÃO** adicione TODO para partes não implementadas

### SE vendo oportunidade de refatoração futura
→ **ENTÃO** adicione TODO explicando o que pode melhorar

### SE criando função de setup/bootstrap
→ **ENTÃO** adicione TODOs para elementos que serão incorporados

## AÇÕES OBRIGATÓRIAS

### Formato de TODO
```typescript
// TODO: Descrição clara do que precisa ser feito
// TODO: Implementar validação de email duplicado
// TODO: Adicionar cache para melhorar performance
// TODO: Refatorar para usar async/await
```

### TODO em comentários de função
```typescript
/**
 * Initial Setup - Database Seeding
 * 
 * Creates all essential initial data.
 * 
 * - TODO: Initial admin account (first user)
 * - TODO: Default roles (admin, user, etc)
 * - TODO: Basic policies (permission definitions)
 * - TODO: Default groups (organizational structure)
 */
export const initSetup = async () => {
  // implementação atual
};
```

### TODO inline
```typescript
export const processData = async (data: Data) => {
  // TODO: Add input validation
  const result = await transform(data);
  
  // TODO: Implement caching mechanism
  return result;
};
```

## GUARDRAILS OBRIGATÓRIOS

### TODO sempre no código
- **NUNCA** apenas mencione "isso precisa ser feito" em conversa
- **SEMPRE** adicione TODO no código fonte
- **SEMPRE** seja específico sobre o que precisa ser feito
- **NUNCA** use TODO genérico sem contexto

### Clareza obrigatória
- **Descrição clara** do que precisa ser implementado
- **Contexto suficiente** para entender o TODO depois
- **Acionável** - deve ser claro o que fazer

## PADRÕES DE RECONHECIMENTO

### Situações que exigem TODO:
- Funcionalidade parcialmente implementada
- Melhorias de performance identificadas
- Refatorações necessárias
- Validações faltantes
- Features planejadas mas não implementadas
- Elementos de setup/bootstrap não criados

### TODO bem escrito quando vejo:
- `// TODO: Add email uniqueness validation in database`
- `// TODO: Implement rate limiting for this endpoint`
- `// TODO: Refactor to use repository pattern`

### TODO mal escrito quando vejo:
- `// TODO: Fix this` (sem contexto)
- `// TODO: Improve` (muito vago)
- `// TODO: Later` (não acionável)

## REGRA DE OURO

**"Se identificou algo que precisa ser feito, adicione TODO no código. Código é a fonte da verdade."**
