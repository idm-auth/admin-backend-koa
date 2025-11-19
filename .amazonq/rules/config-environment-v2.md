# Configuração e Ambiente - IA Rules

## TRIGGERS AUTOMÁTICOS - DOCUMENTAÇÃO

### SE escrevendo documentação
→ **ENTÃO** NUNCA use emojis ou ícones, use texto simples

### SE criando README
→ **ENTÃO** use headers simples, listas e linguagem profissional

### SE fazendo log ou comentário
→ **ENTÃO** NUNCA use emojis, mantenha texto direto

### SE organizando conteúdo
→ **ENTÃO** use formatação markdown padrão (headers, bold, italic)

## TRIGGERS AUTOMÁTICOS - VSCODE

### SE configurando projeto com devcontainer
→ **ENTÃO** SEMPRE configure no `.devcontainer/devcontainer.json`

### SE configurando VSCode
→ **ENTÃO** NUNCA use `.vscode/settings.json` em projetos com devcontainer

### SE definindo configurações
→ **ENTÃO** use seção `customizations.vscode.settings`

## AÇÕES OBRIGATÓRIAS

### Documentação sem emojis
```markdown
# ✅ Correto
## Funcionalidades Principais
- Autenticação JWT
- Sistema RBAC

# ❌ Incorreto  
## 🚀 Funcionalidades Principais
- ✅ Autenticação JWT
- 🔐 Sistema RBAC
```

```typescript
// ✅ Correto
logger.info('Account created successfully');

// ❌ Incorreto
logger.info('✅ Account created successfully');
```

### VSCode DevContainer obrigatório
```json
// .devcontainer/devcontainer.json
{
  "customizations": {
    "vscode": {
      "extensions": [
        "vitest.explorer",
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "AmazonWebServices.amazon-q-vscode"
      ],
      "settings": {
        "vitest.enable": true,
        "vitest.commandLine": "npx vitest",
        "vitest.include": ["tests/**/*.test.ts"]
      }
    }
  }
}
```

## GUARDRAILS OBRIGATÓRIOS

### Documentação profissional
- **NUNCA** use emojis em documentação, código, logs ou commits
- **SEMPRE** mantenha linguagem profissional e direta
- **SEMPRE** use formatação markdown padrão
- **SEMPRE** priorize clareza e acessibilidade

### Configuração centralizada
- **SEMPRE** configure no devcontainer quando disponível
- **NUNCA** use configurações locais em projetos com devcontainer
- **SEMPRE** mantenha extensões obrigatórias configuradas

## PADRÕES DE RECONHECIMENTO

### Documentação correta quando vejo:
- Texto simples sem emojis ou ícones
- Headers organizados hierarquicamente
- Linguagem profissional e técnica
- Formatação markdown consistente

### VSCode correto quando vejo:
- Configurações no `.devcontainer/devcontainer.json`
- Extensões obrigatórias listadas
- Configurações Vitest corretas
- Sem arquivos `.vscode/settings.json`

## REGRA DE OURO

**"Documentação profissional, configuração centralizada. Sem emojis, sem exceções."**