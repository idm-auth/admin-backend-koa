# Princípios de Debugging e Resolução de Problemas

## REGRA FUNDAMENTAL: NÃO FAÇA GAMBIARRAS

### Quando encontrar um problema, NUNCA:
- Adicione `if` desnecessários para "contornar" o problema
- Torne campos obrigatórios em opcionais só para funcionar
- Modifique middleware/core para acomodar um caso específico
- Crie "jeitinhos" ou workarounds
- Modifique código correto para fazer teste passar

### SEMPRE faça isso quando algo não funciona:

1. **PARE** - Não continue tentando "dar um jeitinho"
2. **ANALISE** - Identifique se a estrutura/lógica/arquitetura está correta
3. **PERGUNTE** - "Não consegui resolver de forma simples, posso investigar X ou Y?"

### Hierarquia de Correção:

1. **Teste está errado** → Corrigir o teste
2. **Dados de entrada estão errados** → Corrigir os dados
3. **Configuração está errada** → Corrigir a configuração
4. **Lógica de negócio está errada** → Corrigir a lógica
5. **Arquitetura está errada** → Refatorar (COM PERMISSÃO)

### NUNCA modifique:
- Middleware funcionando para acomodar um teste
- Validações corretas para "facilitar"
- Arquitetura sólida para resolver problema pontual
- Código que está funcionando em outros lugares

### Princípio do Teste:
**O TESTE SERVE O CÓDIGO, NÃO O CONTRÁRIO**
- Se o teste não passa, o teste pode estar errado
- Se a funcionalidade funciona manualmente, investigue o teste
- Teste deve validar comportamento real, não forçar comportamento

### Exemplos de GAMBIARRAS que são PROIBIDAS:

```typescript
// ❌ GAMBIARRA - tornar obrigatório em opcional
const schema = z.object({
  email: z.string().optional() // era required, mudou para passar no teste
});

// ❌ GAMBIARRA - if desnecessário
if (request.body?.required !== false) {
  // lógica complexa só para um caso específico
}

// ❌ GAMBIARRA - modificar middleware para um teste
const bodyData = ctx.request.body || {}; // mudança só para teste passar
```

### Processo Correto:

1. **Identifique o problema real** (não os sintomas)
2. **Verifique se a arquitetura está correta**
3. **Se estiver correta, PARE e PERGUNTE**
4. **Investigue junto com o usuário**
5. **Use logs de debug quando necessário** (veja seção Debugging)
6. **Corrija a causa raiz, não os sintomas**

### Debugging com Logs:

Quando não conseguir identificar o problema:

1. **Execute testes com LOGGER_LEVEL=debug**:
   ```bash
   LOGGER_LEVEL=debug npm test [arquivo-teste]
   ```

2. **Analise os logs estruturados** para identificar:
   - Middlewares sendo executados
   - Dados sendo processados
   - Validações sendo aplicadas
   - Fluxo de execução

3. **Compare com funcionalidade similar** que funciona

4. **Identifique onde o fluxo diverge** do esperado

### Execução de Testes - REGRAS CRÍTICAS:

**SEMPRE limite output para máximo 50 linhas:**
```bash
# Execução geral - OBRIGATÓRIO com limite
npm test 2>&1 | tail -50

# Teste específico
npm test arquivo.test.ts 2>&1 | tail -50

# Com debug
LOGGER_LEVEL=debug npm test arquivo.test.ts 2>&1 | tail -50

# Para desenvolvimento
LOGGER_LEVEL=debug npm run dev
```

**NUNCA execute `npm test` sem `| tail -50` - explode o contexto**

### Frases que indicam GAMBIARRA:
- "Vou adicionar um if para..."
- "Vou tornar opcional para..."
- "Vou modificar o middleware para..."
- "Vou criar um wrapper para..."
- "Vou dar um jeitinho..."

### Frases CORRETAS:
- "A estrutura parece correta, mas não funciona"
- "Preciso investigar por que..."
- "Posso tentar A ou B, qual você prefere?"
- "Não consegui resolver de forma simples"

## LEMBRE-SE:
**Se a arquitetura está correta, a lógica está correta, mas não funciona - o problema está em outro lugar. PARE e INVESTIGUE.**

**Use LOGGER_LEVEL=debug para obter mais informações sobre o fluxo de execução.**

**SEMPRE use `| tail -50` ao executar testes para evitar explosão de contexto.**