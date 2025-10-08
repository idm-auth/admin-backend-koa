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
- ❌ `console.log('message')`
- ❌ `console.error('error')`

### Sempre use o logger apropriado
- ✅ `const logger = getLogger(); logger.info('message')`
- ✅ `const logger = getLogger(); logger.error('error')`

## Níveis de Log
- `logger.error()` - Erros que precisam atenção
- `logger.warn()` - Avisos importantes
- `logger.info()` - Informações gerais
- `logger.debug()` - Debug detalhado

## Pino Logger - Ordem de Parâmetros
- Para logs com erro: `logger.error(error, 'mensagem')`
- Para logs simples: `logger.error('mensagem')`
- **SEMPRE** coloque o objeto de erro como primeiro parâmetro
- Exemplos:
  - ✅ `logger.error(error, 'Falha na operação')`
  - ✅ `logger.error('Mensagem simples')`
  - ❌ `logger.error('Mensagem', error)` // Ordem incorreta

## Contexto
- Em controllers/services: logger automaticamente inclui requestId do contexto
- Em outros arquivos: logger global sem contexto específico

## Formatação de Objetos
- Para objetos complexos: use template strings
- ✅ `logger.error(`Config: ${JSON.stringify(config, null, 2)}`)`
- ❌ `logger.error('Config:', JSON.stringify(config))` // Dois parâmetros