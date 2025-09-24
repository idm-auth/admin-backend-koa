# Zod Configuration Rules

## Version
- **SEMPRE use Zod v4** - não use versões anteriores
- Verifique se está instalado: `npm list zod`
- Se necessário, atualize: `npm install zod@^4.0.0`

## Syntax
- Use `z.email()` em vez de `z.string().email()`
- Use `z.string({ error: 'message' })` para campos obrigatórios
- Para validações customizadas: `error: (issue) => { ... }`

## Validation Messages
- Sempre em inglês
- Mensagens claras e específicas
- Diferencie entre campo obrigatório e formato inválido

## Password Validation
- Siga diretrizes OWASP
- Mínimo 8 caracteres
- Pelo menos: 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial