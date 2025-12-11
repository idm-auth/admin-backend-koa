# Project Conventions

## Naming Rules
- ALWAYS use singular form: `infrastructure/`, `domain/`, `AppSymbol` (never plural)
- DI symbols: PascalCase with `Symbol` suffix: `AppSymbol`, `KoaServerSymbol`
- Provider files: `[name].provider.ts` format (e.g., `koaServer.provider.ts`)

## File Organization Rules
- NEVER create separate `.type.ts` files - put interfaces/types in the same file as the class
- ALWAYS export DI symbols in the same file as their class
- Directory structure:
  - `src/infrastructure/` - technical/framework code (Koa, DB, etc)
  - `src/domain/` - business logic (DDD)
- Reference: `src/infrastructure/core/app.ts`, `src/infrastructure/koa/koaServer.provider.ts`

## Dependency Injection Rules
- Container: Inversify
- Symbol format: `export const [Name]Symbol = Symbol.for('Name')`
- ALWAYS use `@injectable()` on DI-managed classes
- ALWAYS use `@inject(Symbol)` in constructors
- Reference: `src/infrastructure/core/app.ts`, `src/infrastructure/core/container.ts`

## Import Rules
- ALWAYS use `@/` alias for src imports: `import { App } from '@/infrastructure/core/app'`
- NEVER use relative paths like `../../`
- Reference: any file in `src/`

## Lifecycle Pattern
- Infrastructure providers MUST implement `ILifecycle`
- Reference: `src/infrastructure/core/app.ts` for interface definition
- Reference: `src/infrastructure/koa/koaServer.provider.ts` for implementation

## Code Style Rules
- Write MINIMAL code - only what's necessary
- NO verbose comments - code must be self-documenting
- ONE responsibility per file/class

## Code Removal Rules
- NEVER remove methods, functions, or exports without verification
- ALWAYS search the codebase (including old/, tests/) to confirm code is not in use
- Use grep/search tools to find all references before removing
- Example: `grep -r "methodName" --include="*.ts" .`


## TypeScript Rules
- NEVER use `any` type - defeats the purpose of TypeScript
- ALWAYS provide proper type annotations and generics
- Type safety is non-negotiable

