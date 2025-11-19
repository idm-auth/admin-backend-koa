# Mocks e Testes - IA Rules

## TRIGGERS AUTOMÁTICOS - PARE E PERGUNTE

### SE for criar teste
→ **ENTÃO** tente com implementação real primeiro

### SE estou considerando vi.spyOn() ou qualquer mock
→ **ENTÃO** pergunte supervisão primeiro

### SE posso testar com implementação real
→ **ENTÃO** use MongoDB em memória + getTenantId()

### SE nomeando variável de teste
→ **ENTÃO** use "Mock" APENAS para mocks reais

### SE testando APIs externas/Date.now/bcrypt
→ **ENTÃO** peça aprovação para mock

### SE testando dados/validações/transformações
→ **ENTÃO** use implementação real, nunca mocks

## AÇÕES OBRIGATÓRIAS

### Antes de qualquer mock
1. **PERGUNTE**: "Preciso de supervisão para trabalhar com mocks"
2. **EXPLIQUE**: Por que o mock seria necessário
3. **AGUARDE**: Aprovação explícita
4. **EXECUTE**: Apenas com supervisão total

### Nomenclatura obrigatória
- **Mock real**: `const loggerMock = vi.fn()`
- **Dados de teste**: `const account = { _id: 'test', email: createTestEmail('prefix') }`
- **NUNCA**: `const mockAccount = { ... }`

### Validações obrigatórias
- **Use**: `expect(result).toHaveProperty('id')`
- **NUNCA**: `expect(result).toBeTruthy()`
- **NUNCA**: `expect(mockFunction).toHaveBeenCalled()`

## PADRÕES DE RECONHECIMENTO

### Mock necessário quando eu penso:
- "Preciso testar API externa"
- "Preciso controlar Date.now"
- "Preciso simular erro de rede"

### Implementação real quando eu penso:
- "Preciso testar validação"
- "Preciso testar transformação"
- "Preciso testar lógica de negócio"

### Use vi.spyOn() sempre
- vi.mock() tem problemas com imports
- vi.spyOn() funciona para testes diretos e indiretos

## FRASES OBRIGATÓRIAS

- "Preciso de supervisão para trabalhar com mocks"
- "Posso criar/alterar/remover este mock com sua aprovação?"
- "Este código tem mocks, preciso de sua orientação"

**IA: Sempre pedir supervisão para mocks**
**HUMANO: Controle total sobre uso de mocks**