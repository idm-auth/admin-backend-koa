# Prioridades e Duplicação de Testes

## Princípio Fundamental

**PRIORIDADE ABSOLUTA: TESTES DE INTEGRAÇÃO**

Testes de integração sempre têm prioridade sobre testes unitários. Testes unitários devem cobrir apenas o que os testes de integração não conseguem cobrir.

## Hierarquia de Prioridades

### 1. **Testes de Integração** (Prioridade Máxima)
- **SEMPRE criar primeiro** quando possível
- **Cobrem fluxo completo** da API até o banco
- **Testam comportamento real** do sistema
- **Validam integração** entre todas as camadas
- **Detectam problemas reais** de produção

### 2. **Testes Unitários** (Apenas para lacunas)
- **APENAS para cenários não cobertos** pela integração
- **Funções utilitárias específicas** (comparePassword, hashPassword)
- **Cenários de erro específicos** não exercitados pela integração
- **Edge cases isolados** difíceis de reproduzir na integração
- **Lógica pura** sem dependências externas

## Regras de Duplicação

### ❌ NUNCA assuma duplicação pelo nome do arquivo
```bash
# ❌ INCORRETO - Assumir duplicação
tests/unit/domains/realms/accounts/service/create.test.ts
tests/integration/domains/realms/accounts/post.test.ts
# Podem testar cenários completamente diferentes!
```

### ✅ SEMPRE analise o conteúdo dos testes
```typescript
// Teste unitário pode testar cenário específico:
it('should throw ValidationError for duplicate email', async () => {
  // Cenário de erro específico não coberto pela integração
});

// Teste de integração testa fluxo completo:
it('should create account successfully via API', async () => {
  // Fluxo HTTP completo
});
```

## Processo de Análise de Duplicação

### 1. **Leia o conteúdo de ambos os testes**
- Compare os cenários testados
- Identifique se testam a mesma funcionalidade
- Verifique se há valor único em cada teste

### 2. **Identifique valor específico do teste unitário**
- Testa função utilitária não exercitada pela integração?
- Testa cenário de erro específico?
- Testa edge case isolado?
- Testa lógica pura sem dependências?

### 3. **Remova apenas se realmente duplicado**
- Mesmo cenário testado
- Mesma cobertura de código
- Nenhum valor adicional no teste unitário

## Quando Criar Novos Testes

### Processo Obrigatório:
1. **SEMPRE tente integração primeiro**
2. **Se não for possível**, justifique por que
3. **Então crie teste unitário**

### Exemplos de quando integração não é possível:
```typescript
// ✅ Função utilitária pura
export const hashPassword = (password: string) => bcrypt.hash(password, 10);

// ✅ Cenário de erro específico difícil de reproduzir
export const validateComplexBusinessRule = (data) => {
  if (complexCondition) throw new SpecificError();
};

// ✅ Edge case isolado
export const parseSpecialFormat = (input) => {
  // Lógica complexa com muitos edge cases
};
```

## Exemplos de Análise Correta

### Caso 1: Não é duplicação
```typescript
// Unit test - Testa cenário específico de erro
it('should throw ValidationError for duplicate email', async () => {
  // Cenário específico não coberto pela integração
});

// Integration test - Testa fluxo HTTP completo
it('should create account successfully', async () => {
  // Fluxo completo da API
});
```

### Caso 2: É duplicação real
```typescript
// Unit test - Testa criação básica
it('should create account with valid data', async () => {
  const account = await service.create(tenantId, data);
  expect(account).toHaveProperty('_id');
});

// Integration test - Testa mesma funcionalidade
it('should create account successfully', async () => {
  const response = await request(app).post('/accounts').send(data);
  expect(response.body).toHaveProperty('_id');
});
// ❌ DUPLICAÇÃO REAL - Remover teste unitário
```

## Benefícios da Priorização

### Testes de Integração:
- **Confiança real** no sistema
- **Detectam problemas** de integração
- **Validam contratos** entre camadas
- **Testam comportamento** do usuário final

### Testes Unitários (quando únicos):
- **Cobertura específica** de edge cases
- **Feedback rápido** para lógica isolada
- **Documentação** de comportamento específico

## Regra de Ouro

**"Se posso testar via integração, sempre uso integração. Unitário apenas para o que integração não consegue cobrir."**

### Checklist antes de criar teste unitário:
- [ ] Tentei cobrir via integração?
- [ ] Por que integração não funciona?
- [ ] Este teste adiciona valor único?
- [ ] Não é duplicação do teste de integração?

## Manutenção de Testes

### Ao encontrar possível duplicação:
1. **Leia ambos os testes completamente**
2. **Compare cenários e objetivos**
3. **Identifique valor único de cada um**
4. **Remova apenas se realmente duplicado**
5. **Documente a decisão** se mantiver ambos

### Sinais de duplicação real:
- ❌ Mesmo cenário testado
- ❌ Mesma cobertura de funcionalidade
- ❌ Nenhum valor adicional específico
- ❌ Teste unitário apenas repete integração

### Sinais de valor único:
- ✅ Cenários diferentes
- ✅ Cobertura de edge cases específicos
- ✅ Teste de funções utilitárias
- ✅ Validação de erros específicos