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