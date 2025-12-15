# Project Conventions

## Framework
- This project uses `koa-inversify-framework` developed locally at `.external/koa-inversify-framework/`
- Framework provides: AbstractController, AbstractService, AbstractRepository, AbstractMapper, AbstractModule
- Framework provides: @Controller, @Service, @Repository, @Mapper decorators
- Framework provides: @Get, @Post, @Put, @Patch, @Delete, @TraceAsync decorators
- Framework provides: MongoDB, Logger, Telemetry, Swagger, Env providers
- Framework rules: `.external/koa-inversify-framework/.amazonq/rules/framework-conventions.md`
- Framework usage guide: `.external/koa-inversify-framework/.doc/usage-guide.md`
- Import from framework: `import { AbstractService } from 'koa-inversify-framework/abstract'`

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
- Framework decorators handle @injectable() automatically: @Controller, @Service, @Repository, @Mapper
- ALWAYS use `@inject(Symbol)` in constructors

## Import Rules
- ALWAYS use `@/` alias for src imports: `import { App } from '@/infrastructure/core/app'`
- NEVER use relative paths like `../../`
- Reference: any file in `src/`

## Module Pattern
- Each domain module extends AbstractModule from framework
- Module binds: Repository, Mapper, Service, Controller
- Module returns controller symbol via getControllerSymbol()
- Reference: `src/domain/realm/account/account.module.ts`

## Code Style Rules
- Write MINIMAL code - only what's necessary
- NO verbose comments - code must be self-documenting
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

