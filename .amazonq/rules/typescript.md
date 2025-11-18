# TypeScript Coding Rules

## Tipos
- NUNCA use `any` - sempre defina tipos específicos ou use `unknown`
- Use interfaces para objetos complexos
- Prefira `type` para unions e primitivos
- **EVITE type casts desnecessários** - use declaração de tipo quando possível

### Type Safety vs Type Casting
```typescript
// ✅ Correto - Declaração de tipo
const user: User = { id: '1', name: 'John' };

// ❌ Incorreto - Cast desnecessário
const user = { id: '1', name: 'John' } as User;

// ✅ Correto - Cast necessário para conversão
const user = unknownData as User;

// ✅ Correto - Cast necessário para mocks complexos
const mockModel = {} as unknown as Model;
```

## Código
- Use async/await em vez de Promises
- Prefira const assertions quando apropriado
- Use optional chaining (?.) e nullish coalescing (??)

## Testes
- Sempre tipar mocks e fixtures
- Use `satisfies` para validação de tipos em testes