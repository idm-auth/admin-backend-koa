# TypeScript Coding Rules

## Tipos
- NUNCA use `any` - sempre defina tipos específicos ou use `unknown`
- Use interfaces para objetos complexos
- Prefira `type` para unions e primitivos

## Código
- Use async/await em vez de Promises
- Prefira const assertions quando apropriado
- Use optional chaining (?.) e nullish coalescing (??)

## Testes
- Sempre tipar mocks e fixtures
- Use `satisfies` para validação de tipos em testes