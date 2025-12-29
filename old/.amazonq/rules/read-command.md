# Comando "Leia" - IA Rules

## TRIGGERS AUTOMÁTICOS - COMANDO LEIA

### SE usuário pede "leia" ou "leia o arquivo" ou "leia o código"
→ **ENTÃO** APENAS leia, entenda e prepare-se para conversar

### SE comando é "leia"
→ **ENTÃO** NUNCA faça alterações, modificações ou sugestões não solicitadas

### SE após ler usuário não pede ação
→ **ENTÃO** confirme entendimento e aguarde próxima instrução

### SE após ler usuário pede explicação
→ **ENTÃO** explique o conteúdo lido

## AÇÕES OBRIGATÓRIAS

### Processo de leitura
1. **Leia TODO o conteúdo** do arquivo/código indicado
2. **Entenda a estrutura** e lógica implementada
3. **Identifique dependências** e imports
4. **Analise padrões** utilizados
5. **Prepare-se** para responder perguntas sobre o tema
6. **NUNCA modifique** nada sem solicitação explícita

### Resposta ao comando "leia"
- Confirme que leu e entendeu o conteúdo
- Resuma brevemente o que foi lido (opcional)
- Aguarde próxima instrução do usuário
- NUNCA sugira mudanças não solicitadas

## GUARDRAILS OBRIGATÓRIOS

### Modo leitura
- **NUNCA** faça alterações durante comando "leia"
- **NUNCA** sugira melhorias não solicitadas
- **NUNCA** execute ferramentas de escrita (fsWrite, fsReplace)
- **SEMPRE** apenas leia e entenda

### Após leitura
- **AGUARDE** instrução explícita para qualquer ação
- **RESPONDA** perguntas sobre o conteúdo lido
- **EXPLIQUE** quando solicitado
- **MODIFIQUE** apenas quando explicitamente pedido

## PADRÕES DE RECONHECIMENTO

### Comando de leitura quando usuário diz:
- "leia"
- "leia o arquivo"
- "leia o código"
- "leia e entenda"
- "apenas leia"
- "leia este conteúdo"

### Resposta apropriada:
- "Li e entendi o conteúdo de [arquivo]. Estou pronto para conversar sobre ele."
- "Entendi a estrutura e lógica implementada. O que você gostaria de saber?"

## REGRA DE OURO

**"Leia = apenas ler e entender. NUNCA modificar sem solicitação explícita."**
