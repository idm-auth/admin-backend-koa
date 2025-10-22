# Cobertura de Código

Este projeto usa o Vitest com provider v8 para análise de cobertura de código.

## Scripts Disponíveis

### Cobertura Completa
```bash
# Executar todos os testes com cobertura
npm run test:coverage

# Executar testes com interface visual e cobertura
npm run test:coverage:ui
```

### Cobertura por Tipo de Teste
```bash
# Cobertura apenas dos testes unitários
npm run test:unit:coverage

# Cobertura apenas dos testes de integração
npm run test:int:coverage
```

### Outros Scripts
```bash
# Executar testes em modo watch
npm run test:watch

# Executar testes normalmente (sem cobertura)
npm run test
```

## Configuração

A cobertura está configurada no `vitest.config.mjs` com:

- **Provider**: v8 (nativo do Node.js)
- **Formatos**: text, html, json, lcov
- **Diretório**: `./coverage`
- **Arquivos incluídos**: `src/**/*.ts`
- **Arquivos excluídos**: 
  - Arquivos de definição de tipos (`.d.ts`)
  - Arquivos de teste (`.test.ts`, `.spec.ts`)
  - Arquivos de entrada (`index.ts`, `app.ts`)
  - Plugins, utils core e middlewares
  - node_modules e tests

## Thresholds (Limites Mínimos)

O projeto está configurado com limites mínimos de 80% para:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Se a cobertura ficar abaixo desses valores, os testes falharão.

## Relatórios

Após executar os testes com cobertura, você encontrará:

### Relatório HTML
- Localização: `./coverage/index.html`
- Abra no navegador para visualização interativa
- Mostra cobertura por arquivo com destaque de linhas não cobertas

### Relatório no Terminal
- Exibido automaticamente após os testes
- Mostra resumo por arquivo e totais

### Outros Formatos
- **JSON**: `./coverage/coverage-final.json`
- **LCOV**: `./coverage/lcov.info` (para integração com ferramentas externas)

## Dicas

1. **Foque na qualidade**: Cobertura alta não garante testes de qualidade
2. **Teste cenários importantes**: Priorize casos de uso críticos
3. **Exclua arquivos desnecessários**: Configure exclusões para arquivos que não precisam de testes
4. **Use o relatório HTML**: Facilita identificar quais linhas não estão cobertas

## Integração com CI/CD

Para usar em pipelines de CI/CD, você pode:

```bash
# Gerar cobertura e falhar se abaixo dos thresholds
npm run test:coverage

# Ou verificar apenas os thresholds sem gerar relatórios
npm run test:coverage -- --reporter=verbose
```

## Troubleshooting

### Erro de dependências
Se encontrar erros relacionados ao `@vitest/coverage-v8`, certifique-se de que a versão seja compatível com o Vitest:

```bash
npm install --save-dev @vitest/coverage-v8@^3.2.4
```

### Performance
Para projetos grandes, você pode:
- Executar cobertura apenas em arquivos modificados
- Usar exclusões mais específicas
- Executar testes em paralelo com `--reporter=verbose`