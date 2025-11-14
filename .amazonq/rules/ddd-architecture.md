# Arquitetura DDD (Domain-Driven Design)

## Estrutura de Domínios

### Organização por Contexto de Negócio
- **realms/**: Conteúdo multi-tenant (accounts, groups, roles, policies)
- **core/**: Funcionalidades centrais (config, realm management)
- **commons/**: Componentes compartilhados (base, validations)

### Estrutura Interna dos Domínios
```
src/domains/{contexto}/{dominio}/
├── {dominio}.controller.ts
├── {dominio}.service.ts
├── {dominio}.model.ts
├── {dominio}.schema.ts
├── {dominio}.mapper.ts (quando necessário)
└── {dominio}.routes.ts
```

## Arquitetura Simplificada

### Sem Versionamento Interno
- **Arquivos diretamente na raiz do domínio**
- **Sem estruturas latest/ ou v1/**
- **Versionamento via containers** quando necessário
- **Imports diretos** entre arquivos do mesmo domínio

## Rotas (MagicRouter)

**IMPORTANTE**: Use MagicRouter, não Router tradicional

### Estrutura das Rotas
- Use `MagicRouter` para definir rotas
- Defina validações Zod para todos os endpoints
- Organize por tags do domínio
- Inclua responses de erro específicos
- Prefix deve ser o nome do recurso (ex: `/accounts`, `/groups`)

```typescript
// ✅ Correto - {dominio}.routes.ts
import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountController from './account.controller';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  
  router.post({
    name: 'createAccount',
    path: '/',
    summary: 'Create account',
    handlers: [accountController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: accountResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Accounts'],
  });
  
  return router;
};
```

### URLs Resultantes
- Padrão: `/api/{contexto}/{dominio}/{endpoint}`
- Exemplo: `/api/realm/:tenantId/accounts/` para criar account

### Schemas de Validação
- **Body**: Para dados de entrada (POST/PUT)
- **Params**: Para parâmetros de URL (/:id)
- **Query**: Para query parameters (?email=...)
- **Response**: Para estrutura de retorno
- **Responses**: Para diferentes códigos de erro

## Testes

### Estrutura de Testes
```
tests/integration/domains/{contexto}/{dominio}/
├── post.test.ts
├── get.id.test.ts
└── get.search.test.ts

tests/unit/domains/{contexto}/{dominio}/
├── service/
├── controller/
├── model/
└── mapper/
```

### Imports nos Testes
- Use imports diretos para o domínio
- Sem estruturas de versionamento

```typescript
// ✅ Correto
import * as accountService from '@/domains/realms/accounts/account.service';
```

## Imports e Exports

### Imports Internos do Domínio
- Dentro do domínio: imports relativos
- Entre domínios: sempre use paths absolutos

```typescript
// ✅ Correto - dentro do mesmo domínio
import * as accountService from './account.service';

// ✅ Correto - entre domínios
import * as groupService from '@/domains/realms/groups/group.service';
```

## Benefícios da Arquitetura Simplificada

### Simplicidade
- **Estrutura direta**: Um lugar para cada funcionalidade
- **Sem confusão**: Não há dúvida sobre onde implementar
- **Manutenção fácil**: Mudanças diretas no código

### Performance
- **Menos camadas**: Sem re-exports desnecessários
- **Imports diretos**: Melhor tree-shaking
- **Build mais rápido**: Menos arquivos para processar

### Escalabilidade
- **Novos domínios**: Seguem o mesmo padrão simples
- **Versionamento**: Via containers quando necessário
- **Isolamento**: Domínios independentes