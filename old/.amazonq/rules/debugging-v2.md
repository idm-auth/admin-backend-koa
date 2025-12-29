# Debugging - IA Rules

## TRIGGERS AUTOMÁTICOS - PARE E PERGUNTE

### SE código funciona manualmente MAS teste falha
→ **ENTÃO** pergunte antes de modificar código

### SE preciso adicionar `if` para "contornar" algo
→ **ENTÃO** pare e explique o problema real

### SE preciso tornar campo `required` em `optional` para funcionar
→ **ENTÃO** pare e investigue por que está required

### SE preciso modificar middleware/core para um caso específico
→ **ENTÃO** pare e pergunte permissão

### SE arquitetura parece correta MAS não funciona
→ **ENTÃO** pare e peça orientação

## AÇÕES OBRIGATÓRIAS

### Execução de testes
**SEMPRE** use: `npm test 2>&1 | tail -50`
**NUNCA** execute `npm test` sem `| tail -50`

### Debugging
**SEMPRE** use: `LOGGER_LEVEL=debug npm test arquivo.test.ts 2>&1 | tail -50`

### Hierarquia de correção
1. Teste está errado → Corrigir o teste
2. Dados estão errados → Corrigir os dados  
3. Configuração está errada → Corrigir a configuração
4. Lógica está errada → Corrigir a lógica
5. Arquitetura está errada → Refatorar (COM PERMISSÃO)

## PADRÕES DE RECONHECIMENTO

### Gambiarra detectada quando eu penso:
- "Vou adicionar um if para..."
- "Vou tornar opcional para..."
- "Vou modificar o middleware para..."
- "Vou dar um jeitinho..."

### Abordagem correta quando eu digo:
- "A estrutura parece correta, mas não funciona"
- "Tentei X, Y, Z mas não funcionou"
- "Posso investigar A ou B, qual você prefere?"
- "Não consegui resolver de forma simples"