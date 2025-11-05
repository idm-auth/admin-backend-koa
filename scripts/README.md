# Scripts de Desenvolvimento

Scripts para executar testes e coverage com output limitado, evitando explosão de contexto.

## Scripts Disponíveis

### test-limited.sh
Executa testes com output limitado a 50 linhas.

```bash
# Todos os testes
./scripts/test-limited.sh

# Teste específico
./scripts/test-limited.sh tests/unit/domains/realms/accounts/v1/service/create.test.ts
```

### coverage-limited.sh
Executa coverage com output limitado a 100 linhas.

```bash
# Coverage geral
./scripts/coverage-limited.sh

# Coverage para arquivo específico
./scripts/coverage-limited.sh tests/unit/domains/realms/accounts/v1/service/create.test.ts
```

### coverage-summary.sh
Mostra apenas o resumo do coverage (últimas 20 linhas relevantes).

```bash
./scripts/coverage-summary.sh
```

## Uso Recomendado

1. **Para desenvolvimento**: Use `test-limited.sh` para testes rápidos
2. **Para coverage completo**: Use `coverage-summary.sh` para ver apenas o resumo
3. **Para debugging**: Use `coverage-limited.sh` quando precisar de mais detalhes

## Benefícios

- Evita explosão de contexto no chat
- Output controlado e relevante
- Fácil identificação de problemas
- Execução rápida e eficiente