# Rules Index

> **IMPORTANTE**: Sempre atualize este index quando criar, modificar ou remover qualquer arquivo de regras!

## Arquivos Consolidados v2 (Principais)

### **architecture-patterns-v2.md** - Arquitetura e Padrões (FUNDAMENTAL)
- **DDD**: Estrutura de domínios, imports, rotas
- **Tenant Pattern**: TenantId sempre primeiro parâmetro (CRÍTICO)
- **Service Pattern**: Retorno direto ou erro específico
- **MagicRouter**: Roteamento obrigatório com validações
- **Responsabilidades**: Controller, service, model separados

### **database-v2.md** - Banco de Dados (CRÍTICO)
- **UUID**: String para _id, referências manuais
- **Tipos**: Banco define todos os tipos (fonte da verdade)
- **Nomenclatura**: Collections com hífen para múltiplas palavras
- **Conversões**: Evitar ao máximo, manter null como null

### **validation-types-v2.md** - Validação e Tipos (CRÍTICO)
- **Zod v4**: Import correto, extendZodWithOpenApi obrigatório
- **TypeScript**: NUNCA any, declaração vs cast
- **Type Checking**: Zero erros permitidos (tolerância absoluta zero)
- **Mappers**: NUNCA definem tipos, importam do schema
- **Localização**: Tipos no .schema.ts ou .model.ts correto

### **utilities-v2.md** - Utilitários e Configuração
- **Imports**: Aliases @/ e @test/ obrigatórios
- **Logging**: Formato estruturado, contexto Koa vs não-Koa
- **Context**: ctx.validated obrigatório, NUNCA validação dupla

### **test-architecture-v2.md** - Arquitetura de Testes (FUNDAMENTAL)
- **1 arquivo = 1 função** - Regra inviolável
- **Prioridade absoluta**: Integração primeiro, unitários para lacunas
- **Duplicação**: NUNCA assuma pelo nome, analise conteúdo
- **Cobertura**: 100% obrigatório (tolerância zero)
- **Estrutura**: DDD por responsabilidade, nomenclatura consistente

### **mocks-and-testing-v2.md** - Mocks com Supervisão (CRÍTICO)
- **IA precisa supervisão total** para qualquer operação com mocks
- **Implementação real primeiro** - tente sempre antes de mock
- **Nomenclatura**: "Mock" apenas para mocks reais
- **Processo**: Sempre pedir permissão antes de trabalhar com mocks

### **debugging-v2.md** - Debugging e Resolução (CRÍTICO)
- **NUNCA gambiarras** - pare e pergunte quando arquitetura não funciona
- **Execução**: `npm test 2>&1 | tail -50` obrigatório
- **Debug**: `LOGGER_LEVEL=debug` para investigação
- **Hierarquia**: Teste → dados → configuração → lógica → arquitetura

### **config-environment-v2.md** - Configuração e Ambiente
- **Documentação**: NUNCA emojis, sempre texto profissional
- **VSCode**: SEMPRE configure no devcontainer, NUNCA local
- **Extensões**: Vitest, Prettier, ESLint, Amazon Q obrigatórias

## Arquivos Específicos (Não Consolidados)

### **jwt-authentication.md** - JWT Authentication (CRÍTICO)
- **authentication: { jwt: true }** - Proteção de rotas no MagicRouter
- **Middleware automático** - NUNCA implemente verificação manual
- **ctx.state.user** - Acesso ao usuário autenticado
- **jwtService** - Geração e verificação de tokens

### **telemetry-tracing.md** - Telemetria e Tracing
- **Implementação obrigatória** em controllers, services, mappers
- **withSpan/withSpanAsync** - NUNCA spans manuais
- **Constantes centralizadas** e atributos padronizados

### **crud-telemetry-mandatory.md** - CRUD Telemetria (CRÍTICO)
- **Telemetria é código mínimo necessário** - precedência sobre minimalismo
- **Templates obrigatórios** para CRUD completo
- **Zero exceções** para domínios com operações CRUD

### **copy-structure.md** - Cópia de Estruturas
- **Código real > rules gerais** - sempre siga o exemplo
- **Leia todos os arquivos** antes de replicar
- **Processo obrigatório** para "analisar e fazer igual"

### **guardrails-preservation.md** - Preservação de Guardrails (META-REGRA)
- **Guardrails não são verbosidade** - são proteções contra erros
- **"Minimal" se aplica ao código**, não às restrições comportamentais
- **Preserve NUNCA/SEMPRE** ao reescrever regras

### **minimal-vs-guardrails.md** - Minimal vs Guardrails (CRÍTICO)
- **Guardrails têm precedência absoluta** sobre instruções de código minimal
- **Telemetria/validações/estrutura** são requisitos funcionais, não verbosidade
- **Minimal = menos código desnecessário**, não menos restrições comportamentais

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

## Consolidação Realizada

### ✅ **Arquivos v2 Criados (8 consolidados):**
- `architecture-patterns-v2.md` (DDD + Tenant + Service + MagicRouter)
- `database-v2.md` (Models + Types + Naming)
- `validation-types-v2.md` (Zod + TypeScript + Type Checking + Mappers)
- `test-architecture-v2.md` (Unit + Integration + Priorities + Coverage)
- `mocks-and-testing-v2.md` (Mocks + Supervision + Nomenclature)
- `debugging-v2.md` (Problem Solving + Principles)
- `utilities-v2.md` (Imports + Logging + Koa Context)
- `config-environment-v2.md` (Documentation + VSCode)

### ✅ **Benefícios Alcançados:**
- **-806 linhas** removidas (55% menos conteúdo)
- **Triggers SE/ENTÃO** para ações acionáveis
- **Guardrails preservados** para comportamento correto
- **Navegação simplificada** com menos arquivos

### ✅ **Arquivos Restantes (Específicos):**
- `telemetry-tracing.md` - Muito específico e extenso
- `crud-telemetry-mandatory.md` - Regra crítica específica
- `copy-structure.md` - Processo específico
- `guardrails-preservation.md` - Meta-regra importante
- `memory-bank/` - Contexto do projeto

---

## Como Usar Este Index

1. **Busque por tema** nos arquivos v2 consolidados
2. **Use Ctrl+F** para encontrar regras específicas
3. **Consulte arquivos específicos** para casos particulares
4. **Atualize este index** ao modificar regras

**Este index é a porta de entrada otimizada para todas as regras!**