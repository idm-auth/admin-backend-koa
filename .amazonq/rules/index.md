# Rules Index

> **CRÍTICO**: [IA-no-use-mock.md](IA-no-use-mock.md) - IA NÃO PODE USAR vi.mock() - RESULTA EM IA DESLIGADA

> **IMPORTANTE**: Sempre atualize este index quando criar, modificar ou remover qualquer arquivo de regras!

## Arquitetura e Padrões

### **ddd-architecture.md** - Domain-Driven Design
- Estrutura de domínios por contexto de negócio
- Organização latest/ e v1/
- Versionamento e compatibilidade

### **tenant-pattern.md** - Padrão TenantId (CRÍTICO)
- TenantId sempre primeiro parâmetro separado
- Assinaturas de função obrigatórias
- Exemplos por operação (CREATE, UPDATE, FIND)

### **service-pattern.md** - Padrão de Services
- Retorno direto ou erro específico
- NUNCA retornar null/undefined
- Estrutura de funções

### **database-models.md** - Modelos de Banco
- UUID como String para _id
- Referências entre modelos
- Base schema e índices

## Desenvolvimento

### **typescript.md** - Regras TypeScript
- NUNCA usar `any`
- Interfaces vs types
- Async/await patterns

### **zod.md** - Validação com Zod v4
- Import obrigatório: `import { z } from 'zod'`
- extendZodWithOpenApi obrigatório
- Sintaxe v4 (z.email() em vez de z.string().email())

### **magic-router.md** - Roteamento
- Uso obrigatório do MagicRouter
- Estrutura de rotas com validações
- Padrões por método HTTP

### **koa-context.md** - Context do Koa
- SEMPRE usar ctx.validated
- NUNCA acessar ctx.params/query/body diretamente
- Evitar validação dupla

## Testes

### **mocks-and-testing.md** - Mocks e Nomenclatura
- Evitar mocks, usar fluxo real
- Sufixo "Mock" APENAS para mocks reais
- Dados de teste com nomes descritivos

### **IA-no-use-mock.md** - IA NÃO PODE USAR MOCKS (CRÍTICO)
- vi.mock() está PROIBIDO para IA em todo o projeto
- IA usar vi.mock() resulta em IA DESLIGADA
- IA só pode usar dados reais e MongoDB em memória
- Se precisar mock, deve ser feito por HUMANO

### **unit-tests.md** - Testes Unitários
- **ARQUITETURA OBRIGATÓRIA**: v1/ com diretórios service/model/mapper/
- **MongoDB em memória disponível** para todos os testes unitários
- Um arquivo por função testada
- NUNCA teste controllers em unitários
- Teste comportamento real com banco, evite mocks desnecessários

### **integration-tests.md** - Testes de Integração
- Estrutura de arquivos por método/endpoint
- Setup com beforeAll e getTenantId
- Cenários obrigatórios (200, 400, 404, 500)

## Debugging e Resolução de Problemas

### **problem-solving.md** - Resolução de Problemas (CRÍTICO)
- NUNCA fazer gambiarras
- Execução de testes com limite de 50 linhas
- Debugging com LOGGER_LEVEL=debug
- Hierarquia de correção

### **debugging-principles.md** - Princípios de Debugging
- Não modificar código correto
- Usar logs estruturados
- Investigação sistemática

## Utilitários e Configuração

### **logging.md** - Sistema de Logs
- Imports corretos por contexto
- Ordem de parâmetros do Pino
- Níveis de log

### **imports.md** - Regras de Imports
- Aliases obrigatórios: @/ para src, @test/ para tests
- SEMPRE usar imports estáticos
- NUNCA usar imports dinâmicos desnecessários
- NUNCA usar paths relativos
- Configuração no tsconfig.json

### **general.md** - Regras Gerais
- Estilo de código
- Separação de responsabilidades
- Exports e imports

### **copy-structure.md** - Cópia de Estruturas
- Processo para "analisar e fazer igual"
- Leitura completa de arquivos
- Replicação exata de padrões

## Documentação e Ferramentas

### **documentation.md** - Formatação
- NUNCA usar emojis ou ícones
- Estrutura de README
- Linguagem profissional

### **vscode.md** - Configurações VSCode
- DevContainer settings
- Extensões obrigatórias
- Configurações Vitest

## Memory Bank (Contexto do Projeto)

### **memory-bank/product.md** - Visão do Produto
- Propósito do projeto (IAM multi-tenant)
- Funcionalidades principais
- Casos de uso

### **memory-bank/tech.md** - Stack Tecnológica
- Dependências principais
- Comandos de desenvolvimento
- Padrões arquiteturais

### **memory-bank/structure.md** - Estrutura do Projeto
- Organização de diretórios
- Padrões de arquivos
- Ambiente de desenvolvimento

### **memory-bank/guidelines.md** - Guidelines de Desenvolvimento
- Convenções TypeScript
- Padrões de importação
- Práticas de segurança

---

## Como Usar Este Index

1. **Para encontrar regras**: Use Ctrl+F neste arquivo
2. **Para aplicar regras**: Vá direto ao arquivo específico
3. **Para criar novas regras**: Adicione entrada neste index
4. **Para modificar regras**: Atualize este index se necessário

## Lembrete Importante

**SEMPRE ATUALIZE ESTE INDEX** quando:
- Criar novo arquivo de regras
- Modificar conteúdo significativo de alguma regra
- Remover ou renomear arquivos
- Reorganizar estrutura de regras

Este index é a porta de entrada para todas as regras do projeto!