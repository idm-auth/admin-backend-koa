# Configurações do VSCode

## DevContainer
- **SEMPRE configure no .devcontainer/devcontainer.json**
- Nunca use .vscode/settings.json em projetos com devcontainer
- Configurações ficam na seção `customizations.vscode.settings`

## Extensões obrigatórias
- `vitest.explorer` - Para testes Vitest
- `esbenp.prettier-vscode` - Formatação
- `dbaeumer.vscode-eslint` - Linting
- `AmazonWebServices.amazon-q-vscode` - Amazon Q

## Configurações Vitest
- `vitest.enable: true`
- `vitest.commandLine: "npx vitest"`
- `vitest.include: ["tests/**/*.test.ts"]`
