# Regras Gerais de Código

## Estilo
- Use português nos comentários e mensagens de commit
- Prefira código explícito a código "inteligente"
- Mantenha funções pequenas e com responsabilidade única

## Arquitetura DDD
- **SEMPRE organize código por domínios** em `src/domains/{contexto}/{dominio}/`
- Use estrutura `latest/` e `v1/` dentro de cada domínio
- Inclua rotas dentro do domínio: `{dominio}.routes.ts`
- Testes organizados por domínio: `tests/integration/domains/{contexto}/{dominio}/v1/`

## Estrutura de Domínios
- **realms/**: Multi-tenant (accounts, groups, roles, policies)
- **auth/**: Autenticação (login, tokens, passwords)
- **core/**: Funcionalidades centrais (config, realm)

## Separação de Responsabilidades
- Controllers: recebem dados, fazem validação de entrada (validateZod) e chamam services
- Services: contêm toda lógica de negócio e recebem dados já validados
- Models: apenas estrutura de dados e validações de schema
- Routes: definição de endpoints com SwaggerRouter
- Schemas: validações Zod para requests/responses
- Controllers fazem validateZod para query parameters, body e params antes de chamar service
- Services recebem tipos já validados (ex: PaginationQuery) e não fazem validação de entrada
- NUNCA coloque validações de negócio no controller
- Use classes de erro personalizadas para diferentes tipos de erro

## Padrão TenantId (CRÍTICO)
- **SEMPRE** tenantId como primeiro parâmetro separado dos dados
- **NUNCA** misture tenantId com dados em objetos
- Veja regras detalhadas em `tenant-pattern.md`

## Rotas (SwaggerRouter)
- **SEMPRE use SwaggerRouter** em vez de Router tradicional
- Defina validações Zod para body, params, query e responses
- Inclua tags do domínio e responses de erro específicos
- Organize rotas dentro do domínio correspondente

## Exports e Imports
- Use `export const` em vez de `const` + `export { }`
- Para versionamento: `export * from '@/domains/{contexto}/{dominio}/latest/{arquivo}'` no v1
- Para sobrescrever: declare nova função com mesmo nome após o `export *`
- Para estender: importe função original e chame + adicione funcionalidade
- Use `import * as service from '@/domains/{contexto}/{dominio}/v1/{arquivo}'` para imports entre domínios
- Evite `export default { }` - prefira named exports
- **NUNCA use barrel exports** - imports diretos são preferíveis

## Assinaturas de Função
- **SEMPRE** siga o padrão tenantId (veja `tenant-pattern.md`)
- TenantId sempre primeiro parâmetro quando necessário
- Dados da operação como parâmetros subsequentes
- Mantenha consistência em toda a aplicação