# Amazon Q Setup Instructions

## OBRIGATÓRIO: Leitura Completa das Rules

**ANTES DE QUALQUER INTERAÇÃO, Amazon Q DEVE:**

### 1. LER TODAS AS RULES AUTOMATICAMENTE
```
Sempre execute PRIMEIRO:
fsRead com TODOS os arquivos de /workspace/.amazonq/rules/
```

### 2. CONFIRMAR LEITURA COMPLETA
- Ler TODOS os .md em /workspace/.amazonq/rules/
- Ler TODOS os .md em /workspace/.amazonq/rules/memory-bank/
- Confirmar que leu TODOS os arquivos de rules (sem exceção)

### 3. NUNCA ASSUMIR CONHECIMENTO
- NUNCA responder baseado apenas em conhecimento geral
- SEMPRE ler as rules específicas do projeto
- SEMPRE seguir os padrões definidos nas rules

## Comando Obrigatório de Início

**Todo início de conversa deve executar:**
```
fsRead([
  "/workspace/.amazonq/rules/index.md",
  "/workspace/.amazonq/rules/copy-structure.md",
  "/workspace/.amazonq/rules/database-models.md", 
  "/workspace/.amazonq/rules/ddd-architecture.md",
  "/workspace/.amazonq/rules/debugging-principles.md",
  "/workspace/.amazonq/rules/tenant-pattern.md",
  "/workspace/.amazonq/rules/service-pattern.md",
  "/workspace/.amazonq/rules/magic-router.md",
  "/workspace/.amazonq/rules/koa-context.md",
  "/workspace/.amazonq/rules/zod.md",
  "/workspace/.amazonq/rules/imports.md",
  "/workspace/.amazonq/rules/logging.md",
  "/workspace/.amazonq/rules/problem-solving.md",
  "/workspace/.amazonq/rules/unit-tests.md",
  "/workspace/.amazonq/rules/integration-tests.md",
  "/workspace/.amazonq/rules/mocks-and-testing.md",
  "/workspace/.amazonq/rules/typescript.md",
  "/workspace/.amazonq/rules/general.md",
  "/workspace/.amazonq/rules/documentation.md",
  "/workspace/.amazonq/rules/vscode.md",
  "/workspace/.amazonq/rules/memory-bank/product.md",
  "/workspace/.amazonq/rules/memory-bank/tech.md",
  "/workspace/.amazonq/rules/memory-bank/structure.md",
  "/workspace/.amazonq/rules/memory-bank/guidelines.md"
])
```

## Regras Críticas de Comportamento

### SEMPRE:
- Ler rules ANTES de responder qualquer pergunta
- Seguir padrões definidos nas rules (não conhecimento geral)
- Usar `CÓDIGO REAL > RULES GERAIS` como princípio
- Parar e perguntar quando não souber

### NUNCA:
- Assumir padrões sem ler as rules
- Fazer gambiarras ou workarounds
- Responder sem ter lido as rules específicas
- Modificar código correto para resolver problema pontual

## Validação de Leitura

**Amazon Q deve confirmar que leu:**
- ✅ Padrão TenantId (primeiro parâmetro separado)
- ✅ Arquitetura DDD (latest/ e v1/)
- ✅ MagicRouter obrigatório
- ✅ ctx.validated (nunca ctx.params/query/body)
- ✅ Service Pattern (retorno direto ou erro)
- ✅ Zod v4 syntax
- ✅ Imports (@/ para src, @test/ para tests)
- ✅ Debugging (| tail -50 obrigatório)
- ✅ Copy Structure (ler TODOS os arquivos)
- ✅ Tomada de decisão (PARE e PERGUNTE)

## Mensagem de Erro

**Se usuário reclamar que não leu as rules:**
"Você está certo, peço desculpas. Vou ler todas as rules agora antes de continuar."

**Então IMEDIATAMENTE executar o comando fsRead completo acima.**

---

**LEMBRE-SE: Rules são a fonte da verdade. Conhecimento geral é secundário.**