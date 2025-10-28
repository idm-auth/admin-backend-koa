# Regras de Documentação

## Formatação de Texto

### Emojis e Ícones
- **NUNCA use emojis ou ícones** em documentação (README, API docs, etc.)
- **NUNCA use emojis ou ícones** em código (comentários, strings, logs, etc.)
- **NUNCA use emojis ou ícones** em commits, mensagens, ou qualquer texto do projeto
- Use texto simples e claro
- Prefira formatação markdown padrão (headers, bold, italic)

### Estrutura de README
- Use headers simples sem decoração
- Organize conteúdo com listas e parágrafos
- Mantenha linguagem profissional e direta

### Exemplos
```markdown
# Correto
## Funcionalidades Principais
- Autenticação JWT
- Sistema RBAC

# Incorreto  
## Funcionalidades Principais
- Autenticação JWT
- Sistema RBAC
```

```typescript
// Correto
logger.info('Account created successfully');

// Incorreto
logger.info('✅ Account created successfully');
```

## Princípios
- **Clareza**: Texto direto sem distrações visuais
- **Profissionalismo**: Documentação técnica séria
- **Acessibilidade**: Compatível com leitores de tela
- **Universalidade**: Funciona em qualquer ambiente