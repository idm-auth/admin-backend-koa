# Regras para Context do Koa

## Acesso a Dados Validados

### SEMPRE use ctx.validated
- **NUNCA acesse diretamente** `ctx.params`, `ctx.query`, `ctx.request.body`
- **SEMPRE use** `ctx.validated` para acessar dados validados pelo middleware
- Dados em `ctx.validated` já passaram por validação Zod e são type-safe

```typescript
// Correto - dados validados
export const create = async (ctx: Context) => {
  const data = ctx.validated.body;
  const { id } = ctx.validated.params;
  const query = ctx.validated.query;
};

// Incorreto - dados não validados
export const create = async (ctx: Context) => {
  const data = ctx.request.body;
  const { id } = ctx.params;
  const query = ctx.query;
};
```

## Estrutura do ctx.validated

### Propriedades disponíveis:
- `ctx.validated.params` - Parâmetros de URL (/:id)
- `ctx.validated.query` - Query parameters (?name=value)
- `ctx.validated.body` - Body da requisição (POST/PUT)
- `ctx.validated.cookies` - Cookies validados

### Exemplo completo:
```typescript
export const update = async (ctx: Context) => {
  const { id } = ctx.validated.params;        // URL params
  const updateData = ctx.validated.body;      // Request body
  const { filter } = ctx.validated.query;    // Query params
  
  const result = await service.update({ id, data: updateData, filter });
  ctx.body = result;
};
```

## Validação Dupla - EVITAR

### NÃO faça validação dupla
- Middleware já valida com schemas das rotas
- **NUNCA** chame `validateZod` novamente no controller
- Use dados de `ctx.validated` diretamente

```typescript
// Incorreto - validação dupla
export const create = async (ctx: Context) => {
  const data = ctx.validated.body;
  const validatedData = await validateZod(data, schema); // Desnecessário!
};

// Correto - usa dados já validados
export const create = async (ctx: Context) => {
  const data = ctx.validated.body; // Já validado pelo middleware
  const result = await service.create(data);
};
```

## Exceções

### Quando usar validateZod no controller:
- **Apenas** para validações específicas não cobertas pelo schema da rota
- **Apenas** para transformações adicionais de dados
- **Nunca** para revalidar dados já validados pelo middleware

```typescript
// Aceitável - validação adicional específica
export const complexOperation = async (ctx: Context) => {
  const baseData = ctx.validated.body;
  
  // Validação adicional específica para esta operação
  const specialData = await validateZod(baseData.special, specialSchema);
  
  const result = await service.complexOperation(baseData, specialData);
};
```

## Type Safety

### ctx.validated é tipado
- Dados em `ctx.validated` mantêm tipos do schema Zod
- IntelliSense funciona corretamente
- Erros de tipo são detectados em compile time

```typescript
// Schema define o tipo
const userCreateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
});

// Controller recebe dados tipados
export const create = async (ctx: Context) => {
  const userData = ctx.validated.body; // Tipado como { name: string, email: string, age: number }
  // IntelliSense funciona: userData.name, userData.email, userData.age
};
```

## Benefícios

### Segurança
- Dados sempre validados antes do uso
- Prevenção de ataques de injeção
- Validação de tipos em runtime

### Produtividade
- Type safety completo
- IntelliSense preciso
- Menos bugs relacionados a tipos

### Consistência
- Padrão único em toda aplicação
- Fácil manutenção
- Código mais limpo e legível
