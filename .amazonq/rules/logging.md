# Regras de Logging

## Imports de Logger

### Para arquivos fora do contexto Koa
- **SEMPRE use** `import { getLogger } from '@/plugins/pino.plugin';`
- Exemplos: utils, plugins, middlewares, routes, schemas

### Para arquivos dentro do contexto Koa
- **SEMPRE use** `import { getLogger } from '@/utils/localStorage.util';`
- Exemplos: controllers, services que recebem Context do Koa

## Uso do Logger

### Nunca use console.log/console.error
- `console.log('message')`
- `console.error('error')`

### Sempre use o logger apropriado
- `const logger = getLogger(); logger.info('message')`
- `const logger = getLogger(); logger.error('error')`

## Níveis de Log
- `logger.error()` - Erros que precisam atenção
- `logger.warn()` - Avisos importantes
- `logger.info()` - Informações gerais
- `logger.debug()` - Debug detalhado

## Pino Logger - Ordem de Parâmetros
- **SEMPRE** coloque o objeto como primeiro parâmetro, mensagem como segundo
- Para logs com contexto: `logger.info({ key: value }, 'mensagem')`
- Para logs com erro: `logger.error({ error, ...context }, 'mensagem')`
- Para logs simples: `logger.info('mensagem')`
- Exemplos:
  - `logger.error({ error, userId: '123' }, 'Falha na operação')`
  - `logger.info({ userId: '123' }, 'Operação realizada')`
  - `logger.info('Mensagem simples')`
  - `logger.error(error, 'mensagem')` // Erro direto como primeiro parâmetro
  - `logger.info('mensagem', { context })` // Ordem incorreta

## Segurança - Prevenção de Log Injection (CWE-117)

### NUNCA use interpolação de strings com dados não confiáveis
```typescript
// ❌ VULNERÁVEL - Log Injection
logger.info(`User ${userName} logged in`); // userName pode conter \n\nFAKE LOG
logger.info(`Status: ${ctx.status}, Route: ${config.name}`); // Perigoso
```

### SEMPRE use formato estruturado do Pino
```typescript
// ✅ SEGURO - Dados estruturados
logger.info({ userName }, 'User logged in');
logger.info({ status: ctx.status, route: config.name }, 'Response validation');
```

### Por que é importante:
- **Previne Log Forging**: Atacantes não podem injetar quebras de linha
- **Mantém integridade**: Logs ficam estruturados e parseáveis
- **Facilita análise**: Dados estruturados são consultáveis
- **Evita corrupção**: Sistemas de monitoramento não são enganados

## Contexto
- Em controllers/services: logger automaticamente inclui requestId do contexto
- Em outros arquivos: logger global sem contexto específico

## Formatação de Objetos
- Para objetos complexos: use template strings
- `logger.error(`Config: ${JSON.stringify(config, null, 2)}`)`
- `logger.error('Config:', JSON.stringify(config))` // Dois parâmetros