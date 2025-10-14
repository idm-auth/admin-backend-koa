/**
 * MagicRouter - Enhanced Koa Router with OpenAPI Integration
 * 
 * Este router combina funcionalidades do Koa Router com geração automática
 * de documentação OpenAPI/Swagger usando zod-to-openapi.
 * 
 * PROBLEMA DE TIPOS GENÉRICOS:
 * 
 * O cast `as MagicRouteConfig<Context>` nos métodos HTTP é necessário devido
 * a uma limitação do sistema de tipos do TypeScript com covariância de generics.
 * 
 * Situação:
 * - swaggerRoutes: Array<MagicRouteConfig<Context>>
 * - configLocal: MagicRouteConfig<TContext> onde TContext extends Context
 * 
 * Mesmo que TContext extends Context, TypeScript não permite a atribuição
 * direta porque TContext pode ser um subtipo mais específico de Context,
 * criando incompatibilidade de covariância.
 * 
 * O cast é type-safe na prática porque:
 * 1. TContext extends Context garante compatibilidade estrutural
 * 2. Em runtime, todos os contexts são compatíveis
 * 3. TypeScript não possui wildcards como Java (<? extends Context>)
 * 
 * Alternativas consideradas:
 * - Array<MagicRouteConfig<any>>: Perde type safety
 * - Union types: Complexidade desnecessária
 * - Conditional types: Over-engineering
 * 
 * O cast é a solução mais pragmática e segura para este caso específico.
 */

import {
  requestValidationMiddleware,
  responseValidationMiddleware,
} from '@/middlewares/validation.middleware';
import { getLoggerNoAsync } from '@/plugins/pino.plugin';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from '@asteasolutions/zod-to-openapi';
import Router from '@koa/router';
import { Context, Next } from 'koa';
import pino from 'pino';
import { registry } from '../../domains/swagger/openApiGenerator';

// HTTP Methods enum for semantic usage
export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export type MagicRouteConfig<TContext extends Context = Context> =
  RouteConfig & {
    name: string;
    middlewares?: Array<(ctx: TContext, next: Next) => Promise<void>>;
    handlers: Array<(ctx: TContext, next: Next) => Promise<void>>;
  };

export type MagicRouteConfigWithoutMethod<TContext extends Context = Context> =
  Omit<MagicRouteConfig<TContext>, 'method'>;

export class MagicRouter {
  private router: Router;

  private swaggerRoutes: Array<MagicRouteConfig<Context>> = [];
  private childRouters: Array<{ pathPrefix: string; router: MagicRouter }> = [];
  private basePath: string;
  private logger: pino.Logger;

  constructor(opts?: Router.RouterOptions) {
    this.router = new Router(opts);
    this.basePath = opts?.prefix || '';
    this.logger = getLoggerNoAsync();
  }

  private buildHandlers<TContext extends Context = Context>(
    config: MagicRouteConfig<TContext>
  ) {
    const middlewares = config.middlewares || [];
    const requestValidation = requestValidationMiddleware<TContext>(config);
    const responseValidation = responseValidationMiddleware<TContext>(config);
    
    return [
      requestValidation,
      ...middlewares,
      ...config.handlers,
      responseValidation,
    ];
  }

  private convertPath(path: string): string {
    // Converte path OpenAPI {param} para Koa :param
    return path.replace(/\{(\w+)\}/g, ':$1');
  }

  useMagic(
    pathPrefixOrRouter: string | MagicRouter,
    router?: MagicRouter
  ): this {
    if (typeof pathPrefixOrRouter === 'string' && router) {
      // useMagic('/path', router)
      this.router.use(
        pathPrefixOrRouter,
        router.routes(),
        router.allowedMethods()
      );
      this.childRouters.push({ pathPrefix: pathPrefixOrRouter, router });
    } else if (pathPrefixOrRouter instanceof MagicRouter) {
      // useMagic(router)
      this.router.use(
        pathPrefixOrRouter.routes(),
        pathPrefixOrRouter.allowedMethods()
      );
      this.childRouters.push({ pathPrefix: '', router: pathPrefixOrRouter });
    }
    return this;
  }

  getSwaggerRoutes(): MagicRouteConfig<Context>[] {
    return this.swaggerRoutes;
  }

  registryAll(parentPrefix: string = ''): void {
    const fullPrefix = parentPrefix + this.basePath;

    // Registra rotas próprias
    this.swaggerRoutes.forEach((route) => {
      const routeConfig = {
        ...route,
        path: fullPrefix + route.path,
      };

      if (process.env.NODE_ENV === 'development') {
        const testRegistry = new OpenAPIRegistry();
        try {
          testRegistry.registerPath(routeConfig);

          const generator = new OpenApiGeneratorV3(testRegistry.definitions);
          generator.generateDocument({
            openapi: '3.0.0',
            info: {
              title: 'API Documentation',
              version: '1.0.0',
            },
          });
        } catch (error) {
          this.logger.error(
            error,
            `Invalid schema in route ${route.name} at ${routeConfig.path}:`
          );
          this.logger.error(
            { testRegistry: testRegistry.definitions },
            `testRegistry:`
          );
          this.logger.error(
            `Route config: ${JSON.stringify(routeConfig, null, 2)}`
          );

          throw error;
        }
      }

      registry.registerPath(routeConfig);
    });

    // Chama registryAll nos routers filhos
    this.childRouters.forEach(({ pathPrefix, router }) => {
      if (router instanceof MagicRouter) {
        router.registryAll(fullPrefix + pathPrefix);
      } else {
        // @ts-expect-error - router pode não ter constructor
        const typeName = router?.constructor?.name ?? typeof router;
        this.logger.error(
          `Router at path '${pathPrefix}' is not a MagicRouter instance. Type: ${typeName}`
        );
      }
    });
  }

  // Métodos para expor funcionalidades do Router
  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }

  getInternalRouter() {
    return this.router;
  }

  // HTTP Methods
  get<TContext extends Context = Context>(
    config: MagicRouteConfigWithoutMethod<TContext>
  ): this {
    const configLocal = { ...config, method: HttpMethod.GET };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.get(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal as MagicRouteConfig<Context>);
    return this;
  }

  post<TContext extends Context = Context>(
    config: MagicRouteConfigWithoutMethod<TContext>
  ): this {
    const configLocal = { ...config, method: HttpMethod.POST };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.post(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal as MagicRouteConfig<Context>);
    return this;
  }

  put<TContext extends Context = Context>(
    config: MagicRouteConfigWithoutMethod<TContext>
  ): this {
    const configLocal = { ...config, method: HttpMethod.PUT };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.put(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal as MagicRouteConfig<Context>);
    return this;
  }

  delete<TContext extends Context = Context>(
    config: MagicRouteConfigWithoutMethod<TContext>
  ): this {
    const configLocal = { ...config, method: HttpMethod.DELETE };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.delete(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal as MagicRouteConfig<Context>);
    return this;
  }

  patch<TContext extends Context = Context>(
    config: MagicRouteConfigWithoutMethod<TContext>
  ): this {
    const configLocal = { ...config, method: HttpMethod.PATCH };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.patch(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal as MagicRouteConfig<Context>);
    return this;
  }
}
