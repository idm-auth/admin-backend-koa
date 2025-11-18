# Rules Index

> **CRÍTICO**: [IA-no-use-mock.md](IA-no-use-mock.md) - IA PRECISA SUPERVISÃO TOTAL PARA MOCKS

> **IMPORTANTE**: Sempre atualize este index quando criar, modificar ou remover qualquer arquivo de regras!

## Arquitetura e Padrões

### **ddd-architecture.md** - Domain-Driven Design
- **Estrutura simplificada**: Arquivos diretamente na raiz do domínio
- **Sem multiversão**: Removidas estruturas latest/ e v1/
- **Versionamento via containers** quando necessário

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

### **mongodb-naming.md** - Nomenclatura MongoDB (NOVO)
- **Hífen obrigatório** para múltiplas palavras em collections
- **NUNCA camelCase** - MongoDB ignora case sensitivity
- **Correspondência** domínio → collection name
- **Padrão kebab-case** para consistência

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

### **IA-no-use-mock.md** - IA E MOCKS COM SUPERVISÃO (CRÍTICO)
- IA PRECISA supervisão total para qualquer operação com mocks
- PROIBIDO criar, alterar ou remover mocks sem aprovação
- IA deve SEMPRE pedir permissão antes de trabalhar com mocks
- Alternativas reais devem ser tentadas primeiro

### **unit-tests.md** - Testes Unitários
- **Estrutura simplificada**: `tests/unit/domains/{contexto}/{dominio}/`
- **MongoDB em memória disponível** para todos os testes unitários
- **Imports diretos** sem versionamento
- Um arquivo por função/funcionalidade testada
- Teste comportamento real com banco, evite mocks desnecessários

### **test-architecture.md** - Arquitetura de Testes (FUNDAMENTAL)
- **1 arquivo por função/funcionalidade** - Princípio inviolável
- **Organização DDD obrigatória** por responsabilidade
- **Nomenclatura consistente**: `{nome}.test.ts`
- **Localização correta** de testes de validação e erro
- **Regras de consolidação** - apenas cenários da mesma função

### **integration-tests.md** - Testes de Integração
- **URLs simplificadas**: `/api/{contexto}/{dominio}/` (sem /v1/)
- Estrutura de arquivos por método/endpoint
- Setup com beforeAll e getTenantId
- Cenários obrigatórios (200, 400, 404, 500)

### **test-priorities.md** - Prioridades e Duplicação de Testes (CRÍTICO)
- **PRIORIDADE ABSOLUTA**: Testes de integração sempre primeiro
- **NUNCA assumir duplicação** apenas pelo nome do arquivo
- **SEMPRE analisar conteúdo** antes de remover testes
- **Unitários apenas** para lacunas não cobertas pela integração
- **Processo obrigatório** para criação de novos testes

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

### **code-coverage.md** - Cobertura de Código (PERFEIÇÃO)
- **"Eu busco a perfeição.... se não for 100%, não está correto"**
- **100% obrigatório** em todas as métricas (statements, branches, functions, lines)
- **Tolerância zero** - 99.9% não é aceitável
- **Processo sistemático** para alcançar perfeição

## Utilitários e Configuração

### **logging.md** - Sistema de Logs
- Imports corretos por contexto
- Ordem de parâmetros do Pino
- Níveis de log

### **imports.md** - Regras de Imports
- Aliases obrigatórios: @/ para src, @test/ para tests
- **Imports diretos** sem versionamento
- SEMPRE usar imports estáticos
- NUNCA usar paths relativos para src/
- Configuração no tsconfig.json

### **telemetry-tracing.md** - Telemetria e Tracing (NOVO)
- **OpenTelemetry SDK** com auto-instrumentação completa
- **Tracing manual** com withSpan/withSpanAsync
- **Constantes centralizadas** para service name/version
- **Padrões obrigatórios** para controllers, services, mappers
- **Atributos padronizados** e hierarquia de spans
- **Jaeger UI** e **Prometheus metrics** integrados

### **crud-telemetry-mandatory.md** - CRUD Telemetria Obrigatória (CRÍTICO)
- **Telemetria é código mínimo necessário** - não é opcional
- **Precedência sobre instruções** de minimalismo
- **Templates obrigatórios** para controller/service/mapper CRUD
- **Checklist obrigatório** antes de considerar CRUD completo
- **Zero exceções** para domínios com operações CRUD

### **general.md** - Regras Gerais
- **Arquitetura simplificada** sem multiversão
- **Versionamento via containers**
- Separação de responsabilidades
- Exports e imports diretos

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

## Arquitetura Atual (Simplificada)

### ✅ **Estrutura Atual:**
- Arquivos diretamente na raiz do domínio
- Imports diretos sem versionamento
- URLs simplificadas nas APIs
- Versionamento via containers quando necessário

### ✅ **Sem Versionamento Interno:**
- Sem estruturas `latest/` e `v1/` em domínios
- Sem re-exports de compatibilidade
- Sem multiversão no código
- Sem URLs com `/v1/` nos testes

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