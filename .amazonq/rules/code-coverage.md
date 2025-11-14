# Regras de Cobertura de Código

## Princípio da Perfeição

**"Eu busco a perfeição.... se não for 100%, não está correto"**

### Cobertura Obrigatória
- **100% Statements** - Todas as declarações devem ser executadas
- **100% Branches** - Todos os caminhos condicionais devem ser testados  
- **100% Functions** - Todas as funções devem ser chamadas
- **100% Lines** - Todas as linhas de código devem ser cobertas

### Tolerância Zero
- ❌ **99.9% não é aceitável** - deve ser 100%
- ❌ **"Quase perfeito" não é perfeito** - busque a perfeição
- ❌ **Imprecisões do tool não são desculpa** - investigue e corrija
- ❌ **Linhas não cobertas devem ser identificadas e testadas**

### Processo para Alcançar 100%
1. **Execute coverage**: `npm run test:coverage`
2. **Identifique linhas não cobertas**: Analise o relatório
3. **Crie testes específicos**: Para cobrir cada linha faltante
4. **Verifique novamente**: Até alcançar 100% em todas as métricas
5. **Não aceite menos que perfeição**: 100% é o único resultado aceitável

### Comandos de Coverage
```bash
# Coverage completo
npm run test:coverage

# Coverage de arquivo específico
npm run test:coverage -- tests/path/to/file.test.ts

# Coverage com UI
npm run test:coverage:ui
```

### Investigação de Linhas Não Cobertas
- **Analise o código fonte**: Identifique exatamente qual linha não está coberta
- **Crie cenários específicos**: Para executar cada caminho de código
- **Use mocks quando necessário**: Para forçar execução de caminhos específicos
- **Teste cenários de erro**: Muitas vezes são os não cobertos

### Exemplos de Cenários Frequentemente Não Cobertos
- **Logs de sucesso**: Em blocos try/catch
- **Caminhos de erro específicos**: Validações edge case
- **Condições raras**: Cenários de race condition
- **Fallbacks**: Caminhos alternativos de execução

## Regra de Ouro

**Se não é 100%, não está pronto. A perfeição é o único padrão aceitável.**