# Regras para Resolução de Problemas

## PRINCÍPIO FUNDAMENTAL: NÃO FAÇA GAMBIARRAS

### NUNCA modifique código correto para resolver problema pontual

**Se a estrutura está correta, a lógica está correta, mas não funciona:**
**PARE e INVESTIGUE a causa raiz**

### SEMPRE pergunte antes de:

- Fazer mudanças estruturais significativas
- Trocar bibliotecas ou abordagens
- Implementar "gambiarras" ou workarounds complexos
- Refatorar código que está funcionando
- Mudar padrões já estabelecidos no projeto
- **Modificar middleware/core para acomodar um caso específico**
- **Tornar campos obrigatórios em opcionais só para funcionar**
- **Adicionar ifs desnecessários para "contornar" problemas**

### Exemplos de GAMBIARRAS PROIBIDAS:

- "Vou adicionar um if para..."
- "Vou tornar opcional para..."
- "Vou modificar o middleware para..."
- "Vou dar um jeitinho..."
- "Vou fazer funcionar adicionando..."

### Exemplos de quando PARAR e PERGUNTAR:

- "A estrutura parece correta, mas não funciona"
- "Tentei X, Y, Z mas não funcionou"
- "Posso investigar A ou B, qual você prefere?"
- "Preciso de orientação sobre como proceder"

### Hierarquia de Correção:

1. **Teste está errado** → Corrigir o teste
2. **Dados de entrada estão errados** → Corrigir os dados
3. **Configuração está errada** → Corrigir a configuração
4. **Lógica de negócio está errada** → Corrigir a lógica
5. **Arquitetura está errada** → Refatorar (COM PERMISSÃO)

### Princípios:

- **Simplicidade primeiro** - sempre tente a solução mais direta
- **Não quebre o que funciona** - evite mudanças desnecessárias
- **Transparência** - comunique quando não souber
- **Colaboração** - peça ajuda em vez de improvisar
- **TESTE SERVE O CÓDIGO** - não modifique código para teste passar

## Debugging com Logs

### Quando não conseguir identificar o problema:

1. **Execute testes com LOGGER_LEVEL=debug**:
   ```bash
   LOGGER_LEVEL=debug npm run test [arquivo-teste]
   ```

2. **Analise os logs estruturados** para identificar:
   - Middlewares sendo executados
   - Dados sendo processados
   - Validações sendo aplicadas
   - Fluxo de execução

3. **Compare com funcionalidade similar** que funciona

4. **Identifique onde o fluxo diverge** do esperado

### Execução de Testes - REGRAS OBRIGATÓRIAS:

**SEMPRE limite a saída para máximo 50 linhas:**
```bash
# Execução geral - SEMPRE com limite
npm test 2>&1 | tail -50

# Para teste específico
npm test arquivo-teste.ts 2>&1 | tail -50

# Para teste unitário específico
npm test -- --reporter=verbose -t "nome do teste"
```

**NUNCA execute `npm test` sem limite de linhas - VAI EXPLODIR O CONTEXTO**

### Debugging com logs:
```bash
# Para um teste específico com debug
LOGGER_LEVEL=debug npm test tests/integration/domains/realms/accounts/v1/post.test.ts 2>&1 | tail -50

# Para desenvolvimento
LOGGER_LEVEL=debug npm run dev
```

### Investigação detalhada:
- Use teste específico por arquivo quando precisar de mais detalhes
- Use teste unitário específico quando souber exatamente qual teste falha
- SEMPRE mantenha limite de 50 linhas no output

## Lembre-se:

**É melhor perguntar e fazer certo do que assumir e fazer gambiarra.**

**Se funciona manualmente mas o teste falha, o problema pode estar no teste.**

**Use LOGGER_LEVEL=debug para obter mais informações sobre o fluxo de execução.**

**NUNCA execute `npm test` sem `| tail -50` - sempre limite a saída para evitar explosão de contexto.**
