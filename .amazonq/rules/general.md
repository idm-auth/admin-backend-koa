# Regras Gerais de Código

## Estilo
- Use português nos comentários e mensagens de commit
- Prefira código explícito a código "inteligente"
- Mantenha funções pequenas e com responsabilidade única
- **Use type safety adequado** - evite type casts desnecessários

### Type Safety
- **Prefira declaração de tipo**: `const data: Type = { ... }`
- **Evite casts desnecessários**: `const data = { ... } as Type`
- **Use casts apenas quando necessário**: conversões, mocks complexos, unknown

## Arquitetura DDD
- **SEMPRE organize código por domínios** em `src/domains/{contexto}/{dominio}/`
- **Estrutura simplificada**: Arquivos diretamente na raiz do domínio
- **Sem versionamento interno**: Sem estruturas latest/ ou v1/
- Inclua rotas dentro do domínio: `{dominio}.routes.ts`
- Testes organizados por domínio: `tests/integration/domains/{contexto}/{dominio}/`

## Estrutura de Domínios
- **realms/**: Multi-tenant (accounts, groups, roles, policies)
- **core/**: Funcionalidades centrais (config, realm)
- **commons/**: Componentes compartilhados (base, validations)

## Separação de Responsabilidades
- Controllers: recebem dados, fazem validação de entrada e chamam services
- Services: contêm toda lógica de negócio e recebem dados já validados
- Models: apenas estrutura de dados e validações de schema
- Routes: definição de endpoints com MagicRouter
- Schemas: validações Zod para requests/responses
- Controllers usam `ctx.validated` (dados já validados pelo middleware)
- Services recebem tipos já validados (ex: PaginationQuery)
- NUNCA coloque validações de negócio no controller
- Use classes de erro personalizadas para diferentes tipos de erro

## Padrão TenantId (CRÍTICO)
- **SEMPRE** tenantId como primeiro parâmetro separado dos dados
- **NUNCA** misture tenantId com dados em objetos
- Veja regras detalhadas em `tenant-pattern.md`

## Rotas (MagicRouter)
- **SEMPRE use MagicRouter** em vez de Router tradicional
- Use métodos HTTP específicos: `router.get()`, `router.post()`, etc.
- Defina validações Zod para request (params, query, body) e responses
- Inclua `summary`, tags do domínio e responses de erro específicos
- Organize rotas dentro do domínio correspondente
- Use `router.useMagic()` para composição hierárquica

## Exports e Imports
- Use `export const` em vez de `const` + `export { }`
- **Imports diretos**: `import * as service from '@/domains/{contexto}/{dominio}/{arquivo}'`
- **Imports relativos** dentro do mesmo domínio: `import * as service from './{arquivo}'`
- Evite `export default { }` - prefira named exports
- **NUNCA use barrel exports** - imports diretos são preferíveis

## Assinaturas de Função
- **SEMPRE** siga o padrão tenantId (veja `tenant-pattern.md`)
- TenantId sempre primeiro parâmetro quando necessário
- Dados da operação como parâmetros subsequentes
- Mantenha consistência em toda a aplicação

## Arquitetura Simplificada
- **Uma versão ativa** por vez na aplicação
- **Versionamento via containers** quando necessário para compatibilidade
- **Sem estruturas de multiversão** no código
- **Deploy independente** de versões diferentes