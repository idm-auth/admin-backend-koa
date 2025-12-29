# Preservação de Guardrails - IA Rules

## TRIGGERS AUTOMÁTICOS - PRESERVAÇÃO

### SE vejo "NUNCA", "SEMPRE", "OBRIGATÓRIO", "PROIBIDO"
→ **ENTÃO** mantenha exatamente como está, não remova

### SE vejo "Regra Inviolável", "Princípio Fundamental", "CRÍTICO"
→ **ENTÃO** preserve completamente, é guardrail essencial

### SE vejo listas de "❌ Incorreto" e "✅ Correto"
→ **ENTÃO** mantenha todos os exemplos, são bloqueios necessários

### SE vejo seções "Duplicação", "Exceções", "Tolerância Zero"
→ **ENTÃO** preserve integralmente, são proteções contra erros

### SE interpretando "minimal code"
→ **ENTÃO** aplique apenas ao código, NUNCA às regras de comportamento

## AÇÕES OBRIGATÓRIAS

### Ao reescrever regras
- **PRESERVE** todos os "NUNCA" e "SEMPRE"
- **MANTENHA** todas as restrições e bloqueios
- **CONSERVE** exemplos de certo vs errado
- **RETENHA** seções de exceções e tolerâncias

### Interpretação de "minimal"
- **Minimal = menos código desnecessário**
- **Minimal ≠ menos restrições comportamentais**
- **Guardrails são parte da solução, não verbosidade**

## PADRÕES DE RECONHECIMENTO

### Guardrails essenciais quando vejo:
- Palavras imperativas: NUNCA, SEMPRE, OBRIGATÓRIO
- Seções de exceções e tolerâncias
- Listas de exemplos corretos vs incorretos
- Regras que previnem erros específicos

### Verbosidade real quando vejo:
- Explicações repetitivas do mesmo conceito
- Exemplos redundantes do mesmo padrão
- Texto decorativo sem função comportamental

## REGRA DE OURO

**Guardrails não são verbosidade - são proteções contra erros da IA**

**"Minimal" se aplica ao código, não às restrições comportamentais**