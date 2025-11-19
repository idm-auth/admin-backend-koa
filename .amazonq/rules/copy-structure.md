# Copiar Estrutura - IA Rules

## TRIGGERS AUTOMÁTICOS - PROCESSO

### SE usuário pede "analisar e fazer igual" ou "copiar estrutura"
→ **ENTÃO** leia TODOS os arquivos do exemplo primeiro

### SE analisando exemplo
→ **ENTÃO** identifique padrões reais, NUNCA assuma baseado em rules gerais

### SE replicando estrutura
→ **ENTÃO** copie exatamente: imports, validações, organização, nomenclatura

### SE há conflito entre rules e código exemplo
→ **ENTÃO** SEMPRE siga o código exemplo - é a fonte da verdade

## AÇÕES OBRIGATÓRIAS

### Processo de análise
1. **Leia TODOS os arquivos** do exemplo (controller, service, model, schema, routes)
2. **Identifique padrões reais** de cada tipo de arquivo
3. **Replique exatamente** estrutura, imports, validações, nomenclatura
4. **Verifique antes de criar** se entendeu corretamente

### Checklist obrigatório
- [ ] Li TODOS os arquivos do exemplo?
- [ ] Identifiquei estrutura de cada tipo de arquivo?
- [ ] Verifiquei imports e dependências?
- [ ] Confirmei padrões de validação e rotas?

## GUARDRAILS OBRIGATÓRIOS

### Precedência absoluta
- **CÓDIGO REAL > RULES GERAIS**
- **SEMPRE** siga o código exemplo quando houver conflito
- **NUNCA** assuma baseado apenas em rules gerais
- **Código existente é a fonte da verdade** do projeto

## REGRA DE OURO

**"Leia tudo, copie exato, código real sempre vence rules gerais."**
