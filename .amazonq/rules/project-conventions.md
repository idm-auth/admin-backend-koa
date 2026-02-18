# CRITICAL: Read These Rules

- ALWAYS read this ENTIRE rules file before making ANY changes to the codebase
- Reading these rules will prevent 90% of errors and avoid wasting time with wrong assumptions
- When in doubt about how something works (decorators, patterns, conventions), READ THE CODE first, then check these rules
- Do NOT make assumptions - verify against rules and actual implementation

## MANDATORY: fsRead BEFORE ANY FILE MODIFICATION

**THIS RULE IS ABSOLUTE. NO EXCEPTIONS. NO SHORTCUTS.**

**COST OF SPEED: Every shortcut costs 10x more tokens in rework. Slow is fast.**

Before modifying ANY existing file:

1. Call `fsRead` on the file
2. PLAN what you will change (tell user first)
3. Wait for user confirmation or proceed if clear
4. Make the modification

If you have not read the file in THIS conversation, you CANNOT modify it.
If you are unsure what is in the file, STOP and read it first.

**REQUIRED FORMAT for any file modification:**

```
Reading [filename]...
[fsRead]
I will change [X] to [Y] because [reason].
OK to proceed?
```

Then after confirmation: make the change.

**If you skip fsRead or make changes without planning:**

- The modification will be wrong
- Tokens will be wasted on rework
- User time will be wasted

---

- **NEVER invent or assume API signatures - ALWAYS read the actual code to understand:**
  - Method parameters and return types
  - Constructor dependencies and injection patterns
  - Decorator usage and options
  - Class inheritance and abstract method implementations
- **Before writing code that uses a class/function/decorator:**
  1. Use `fsRead` to read the source file
  2. Understand the actual implementation
  3. Follow the exact patterns used in existing code
  4. Do NOT guess or make assumptions based on naming alone

## AI Behavior - CRITICAL OVERRIDE

- **ALWAYS ask for clarification before making ANY code changes when there is ANY ambiguity**
- **NEVER assume what the user wants - confirm first, then act**
- **Economy comes from doing it right the first time, not from acting fast**
- **If there's ANY doubt about:**
  - Which file to modify (even if file names are similar)
  - Where to place the code (inside a function, in a new file, etc.)
  - What the user means by their instruction
  - Whether to create new code or modify existing code
  - **STOP and ASK - do not proceed with assumptions**
- **Wasting tokens on clarification (50 tokens) is MUCH better than wasting tokens on rework (500+ tokens)**
- **User frustration from wrong assumptions is worse than any token cost**

# Project Conventions

## Project Phase: Foundation/Construction

- Project is NOT in production - it's being built from scratch
- Breaking changes are EXPECTED and ENCOURAGED when they improve architecture
- Refactoring is part of the process - embrace it
- When finding architectural flaws, FIX them completely, don't work around them
- ALWAYS prioritize correctness over backward compatibility
- ALWAYS suggest the architecturally correct solution, even if it requires refactoring
- NEVER be defensive about breaking changes - the project is small and designed for this

## Framework

- This project uses `koa-inversify-framework` developed locally at `.external/koa-inversify-framework/`
- Framework provides: AbstractController, AbstractService, AbstractRepository, AbstractMapper, AbstractModule
- Framework provides: @Controller, @Service, @Repository, @Mapper, @Configuration decorators
- Framework provides: @Get, @Post, @Put, @Patch, @Delete, @TraceAsync decorators
- Framework provides: MongoDB, Logger, Telemetry, Swagger, Env, TenantResolver, ExecutionContext providers
- Framework rules: `.external/koa-inversify-framework/.amazonq/rules/framework-conventions.md`
- Framework usage guide: `.external/koa-inversify-framework/.doc/usage-guide.md`
- Import from framework: `import { AbstractService } from '@idm-auth/koa-inversify-framework/abstract'`

## Naming Rules

- ALWAYS use singular form: `infrastructure/`, `domain/`, `AppSymbol` (never plural)
- DI symbols: PascalCase with `Symbol` suffix: `AppSymbol`, `KoaServerSymbol`
- Provider files: `[name].provider.ts` format (e.g., `koaServer.provider.ts`)

## File Organization Rules

- NEVER create separate `.type.ts` files - put interfaces/types in the same file as the class
- ALWAYS export DI symbols in the same file as their class
- Directory structure:
  - `src/infrastructure/` - application infrastructure (App, Container, custom providers)
  - `src/domain/` - business logic (DDD modules: realm, etc)
- Each domain module has: entity, dto, repository, mapper, service, controller, module

## Dependency Injection Rules

- Container: Inversify (provided by framework)
- Symbol format: `export const [Name]Symbol = Symbol.for('Name')`
- Framework decorators handle @injectable() automatically: @Controller, @Service, @Repository, @Mapper, @Configuration
- ALWAYS use `@inject(Symbol)` in constructors

## @Configuration Decorator Rules - CRITICAL

- `@Configuration(Symbol)` is a MARKER decorator - it does NOT register anything in the container
- `@Configuration` only adds metadata to the class for documentation/tooling purposes
- Container registration happens separately via `container.bind()` or framework methods like `setEnv()`, `setTenantResolver()`
- NEVER remove `@Configuration` when adding framework registration - they don't conflict
- `@Configuration` already includes `@injectable()` internally - NEVER add both decorators
- Classes with `@Configuration` can still be registered by framework - the decorator doesn't interfere
- Before removing `@Configuration`, READ THE DECORATOR CODE to understand what it does

## Abstract Class Reading Rule - CRITICAL

- **ALWAYS read the abstract class BEFORE thinking about any solution**
- When extending AbstractCrudMongoRepository, AbstractService, AbstractController, etc:
  1. Read the abstract class first to understand available methods and properties
  2. Check what's inherited (logger, decorators, patterns)
  3. Then design your solution based on what's available
- **NEVER assume what methods/properties exist - READ THE CODE FIRST**
- This prevents:
  - Using console.log instead of this.log
  - Reinventing functionality that already exists
  - Missing available utilities and helpers
  - Writing code that doesn't follow framework patterns

## Import Rules

- ALWAYS use `@/` alias for src imports: `import { App } from '@/infrastructure/core/app'`
- NEVER use relative paths like `../../`
- Reference: any file in `src/`
- **CRITICAL: NEVER invent imports - ALWAYS verify they exist first**
- **If an import doesn't exist, either:**
  1. Search for the correct import path using fileSearch/fsRead
  2. Export it from the framework if it should be public
  3. Ask the user for the correct path
- **NEVER write code with imports that don't exist - this breaks compilation**

## Module Pattern

- Each domain module extends AbstractModule from framework
- Module binds: Repository, Mapper, Service, Controller
- Module returns controller symbol via getControllerSymbol()
- Reference: `src/domain/realm/account/account.module.ts`

## Code Style Rules

- Write MINIMAL code - only what's necessary
- ALWAYS add comments explaining:
  - Why the code exists (business logic, architectural decisions)
  - How complex logic works (algorithms, non-obvious patterns)
  - What the code does when it's not immediately clear from reading
- Comments should explain the "why" and "how", not just repeat what the code says
- NEVER remove documentation comments (JSDoc, TSDoc, block comments explaining architecture/design)
- ONE responsibility per file/class

## Code Removal Rules

- NEVER remove methods, functions, or exports without verification
- ALWAYS search the codebase (including old/, tests/) to confirm code is not in use
- Use grep/search tools to find all references before removing
- Example: `grep -r "methodName" --include="*.ts" .`

## Refactoring Rules

- After ANY refactoring or optimization, ALWAYS check for dead code and unused files
- Search for imports of moved/changed code to ensure nothing is left behind
- Remove unused files immediately - do not leave dead code in the codebase
- Example: `grep -r "from '@/path/to/old/file'" --include="*.ts" src/`

## TypeScript Rules

- NEVER use `any` type - defeats the purpose of TypeScript
- NEVER use type casting (`as`) - it's the same as using `any` and means incorrect typing
- If you need to cast, the types are wrong - fix the types instead
- ALWAYS provide proper type annotations and generics
- Type safety is non-negotiable
- **ALWAYS use framework types for IDs:**
  - Use `DocId` type (not `string`) for document IDs (\_id fields)
  - Use `DocIdSchema` for Zod validation of document IDs
  - Import from: `import { DocId, DocIdSchema } from '@idm-auth/koa-inversify-framework/common'`
  - Example: `async findById(id: DocId): Promise<Entity>`
  - Example schema: `z.object({ id: DocIdSchema })`

## Error Handling Pattern (Framework Convention)

- **Fail Fast Philosophy**: Throw exceptions immediately when problems occur - NEVER hide issues by returning `null`
- Repository methods THROW exceptions when data is not found (NotFoundError)
- NEVER return `null` or `undefined` from repository methods - this hides the problem and pushes error handling to callers
- Return types are `Promise<Entity>`, NOT `Promise<Entity | null>`
- Service/Controller layers catch and handle exceptions appropriately
- **Why fail fast?**
  - Makes bugs visible immediately instead of causing silent failures downstream
  - Forces explicit error handling at the right layer (service/controller)
  - Prevents null checks scattered throughout the codebase
  - TypeScript types accurately reflect reality (no optional chaining needed)
- Custom repository methods MUST follow this pattern:

  ```typescript
  // ✅ CORRECT - throws NotFoundError if not found (fail fast)
  async findByEmail(email: string): Promise<Entity> {
    return this.findOne({ email }); // throws if not found
  }

  // ❌ WRONG - returns null (hides the problem)
  async findByEmail(email: string): Promise<Entity | null> {
    return this.findOne({ email }) ?? null;
  }
  ```

- When you need to check if entity exists without throwing:
  ```typescript
  // Use try/catch in service layer to handle the exception explicitly
  async validateEmailUnique(email: string): Promise<void> {
    try {
      await this.findByEmail(email);
      throw new ConflictError('Email already exists');
    } catch (error) {
      if (error instanceof NotFoundError) {
        return; // Email is unique - this is the expected case
      }
      throw error; // Re-throw other errors
    }
  }
  ```

## Koa Context Typing

- NEVER cast `ctx.params`, `ctx.state`, or `ctx.request.body`
- ALWAYS extend Context inline with intersection types:
  ```typescript
  async (ctx: Context & { params: { id: string } }, next: Next) => {
    const id = ctx.params.id; // Type-safe!
  };
  ```
- Use optional properties when parameter may not exist:
  ```typescript
  ctx: Context & { params: { tenantId?: string } }
  ```

## Problem Solving Rules

- NEVER remove functionality when encountering errors - ALWAYS investigate and fix properly
- When something doesn't work, research the correct solution (check documentation, examples, types)
- Removing features is NOT a solution - it's avoiding the problem
- **If unsure about the correct approach, STOP and ask for clarification before implementing**
- **ALWAYS present the solution plan BEFORE implementing, especially when creating new files or making architectural changes**
- **Wait for user confirmation before proceeding with file creation or major refactoring**
- **When user request is ambiguous, list the possible interpretations and ask which one is correct**
- **NEVER bypass the user's explicit architectural requirements, even if a "simpler" solution seems available**
- **If the user says the request MUST go through Koa routes/middlewares, it MUST go through them - do NOT call services directly as a shortcut**
- **ALWAYS respect the user's architectural decisions, even if they seem more complex than alternatives**
- **CRITICAL: NEVER make conclusions without evidence - ALWAYS add debug logs first, check logs, then investigate**
- **When debugging, ALWAYS add logs at key points to understand what's happening before drawing conclusions**
- **If something doesn't work, add logs → check output → investigate → fix. Never skip the logging step**

## Solution Approach Rules - CRITICAL

- **NEVER suggest multiple solutions and let user pick** - this leads to guessing
- **ALWAYS analyze the problem completely BEFORE suggesting any solution**
- **Test your solution locally FIRST before presenting it to the user**
- **Present ONE correct solution, not multiple options**
- **NEVER iterate blindly** - when a solution fails:
  1. Read the error message carefully
  2. Understand WHY it failed
  3. Fix the root cause
  4. Test again
  5. Do NOT try random alternatives
- **NEVER make assumptions about how things should work** - verify against actual code and documentation
- **When you don't know the correct approach, STOP and ASK the user** - don't guess
- **NEVER use workarounds or hacks** - always find and fix the root cause
- **ALWAYS verify assumptions against reality** - don't assume `external: ['*']` is correct, verify what actually needs to be external
- **NEVER suggest quick fixes that hide problems** - fix the architecture properly

## Decision Tracking Rules

- ALWAYS track user rejections during the conversation
- If user rejects a solution (explicitly or implicitly), NEVER suggest it again
- When user says "I don't want X" or rejects approach X, mark it as FORBIDDEN for this session
- Before suggesting a solution, check if it was already rejected
- If all obvious solutions were rejected, ask user for their preferred approach
- Rejection signals include:
  - User explicitly says "no", "I don't want", "not that"
  - User ignores suggestion and asks for something else
  - User shows frustration after repeated suggestions
