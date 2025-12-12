import { glob } from 'glob';
import { pathToFileURL } from 'url';
import { createStereotype } from '@/infrastructure/core/stereotype/stereotype.utils';

const CONTROLLER_METADATA_KEY = Symbol('controller:metadata');
const CONTROLLER_REGISTRY: symbol[] = [];

export interface ControllerMetadata {
  basePath: string;
}

export interface ControllerOptions {
  basePath: string;
}

export function Controller(symbol: symbol, options: ControllerOptions) {
  const baseDecorator = createStereotype(symbol);
  
  return function <T extends new (...args: never[]) => object>(target: T): T {
    const decoratedTarget = baseDecorator(target);
    Reflect.defineMetadata(CONTROLLER_METADATA_KEY, options, decoratedTarget);
    CONTROLLER_REGISTRY.push(symbol);
    return decoratedTarget;
  };
}

export async function getAllControllers(): Promise<symbol[]> {
  const files = await glob('src/domain/**/*.controller.ts', { absolute: true });
  
  await Promise.all(
    files.map((file) => import(pathToFileURL(file).href))
  );
  
  return [...CONTROLLER_REGISTRY];
}

export function getControllerMetadata(
  target: object
): ControllerMetadata | undefined {
  const metadata: unknown = Reflect.getMetadata(CONTROLLER_METADATA_KEY, target);
  if (!metadata) return undefined;
  // Cast necessary: Reflect API returns any, but we control what we store
  return metadata as ControllerMetadata;
}

/**
 * METADATA ARCHITECTURE - FUTURE IMPLEMENTATION
 * 
 * Esta seção documenta a arquitetura de metadata que será implementada
 * para suportar decorators em controllers e methods.
 * 
 * ESTRUTURA DE METADATA KEYS:
 * 
 * Class-level (Controller):
 * - CONTROLLER_BASEPATH = Symbol('controller:basePath')
 * - CONTROLLER_AUTH_DEFAULT = Symbol('controller:auth:default')
 * - CONTROLLER_RATELIMIT_DEFAULT = Symbol('controller:rateLimit:default')
 * 
 * Method-level (Route decorators):
 * - METHOD_ROUTE = Symbol('method:route')
 * - METHOD_AUTH = Symbol('method:auth')
 * - METHOD_RATELIMIT = Symbol('method:rateLimit')
 * - METHOD_VALIDATION = Symbol('method:validation')
 * 
 * PADRÃO DE NOMENCLATURA:
 * {SCOPE}_{FEATURE} ou {SCOPE}_{FEATURE}_{VARIANT}
 * - Scope: CONTROLLER ou METHOD
 * - Feature: BASEPATH, AUTH, RATELIMIT, ROUTE, VALIDATION
 * - Variant: DEFAULT (quando aplicável)
 * 
 * LÓGICA DE MERGE (Controller + Method):
 * 
 * Ao processar uma rota no RegisterRouter:
 * 
 * const controllerAuth = Reflect.getMetadata(CONTROLLER_AUTH_DEFAULT, controllerClass);
 * const methodAuth = Reflect.getMetadata(METHOD_AUTH, controllerClass.prototype, methodName);
 * 
 * // Strategy 1: Override (method sobrescreve controller)
 * const finalAuth = methodAuth ?? controllerAuth;
 * 
 * // Strategy 2: Merge (method complementa controller)
 * const finalAuth = { ...controllerAuth, ...methodAuth };
 * 
 * // Strategy 3: Concatenate (method adiciona ao controller)
 * const finalAuth = [...(controllerAuth || []), ...(methodAuth || [])];
 * 
 * EXEMPLO DE USO FUTURO:
 * 
 * @Controller(AccountControllerSymbol, { 
 *   basePath: '/accounts',
 *   auth: { required: true, methods: ['jwt'] },
 *   rateLimit: { max: 100, window: '1m' }
 * })
 * export class AccountController {
 * 
 *   @Get('/:id')
 *   @Auth({ permissions: ['account:read'] })  // Merge com controller auth
 *   @RateLimit({ max: 10 })                   // Override controller rateLimit
 *   async findById(ctx: Context) { ... }
 * }
 * 
 * VANTAGENS DESTA ARQUITETURA:
 * - Separação clara entre class-level e method-level
 * - Leitura granular (pega só o que precisa)
 * - Cada decorator trabalha independente
 * - Merge explícito no momento do uso
 * - Extensível para novos decorators
 * 
 * REFERÊNCIA:
 * - old/src/utils/core/MagicRouter.ts (implementação anterior)
 * - NestJS metadata pattern (inspiração)
 */
