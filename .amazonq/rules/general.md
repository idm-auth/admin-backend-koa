# Regras Gerais de Código

## Estilo
- Use português nos comentários e mensagens de commit
- Prefira código explícito a código "inteligente"
- Mantenha funções pequenas e com responsabilidade única

## Estrutura
- Organize imports: externos, internos, relativos
- Use barrel exports quando apropriado
- Prefira composição a herança

## Separação de Responsabilidades
- Controllers: apenas recebem dados e chamam services
- Services: contêm toda lógica de negócio e validações
- Models: apenas estrutura de dados e validações de schema
- NUNCA coloque validações de negócio no controller
- Use classes de erro personalizadas para diferentes tipos de erro

## Exports e Imports
- Use `export const` em vez de `const` + `export { }`
- Para versionamento: `export * from '@/path/latest'` no v1
- Para sobrescrever: declare nova função com mesmo nome após o `export *`
- Para estender: importe função original e chame + adicione funcionalidade
- Use `import * as service from '@/path'` para imports de módulos
- Evite `export default { }` - prefira named exports