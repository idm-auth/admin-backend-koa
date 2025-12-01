/**
 * MagicRouter - Enhanced Koa Router with OpenAPI Integration
 *
 * Este router combina funcionalidades do Koa Router com geração automática
 * de documentação OpenAPI/Swagger usando zod-to-openapi.
 *
 * TIPOS GENÉRICOS:
 *
 * MagicRouter<TContext> - Cada router é genérico sobre seu tipo de Context.
 * Todas as rotas de um router específico usam o mesmo TContext.
 * Routers com diferentes TContext podem ser compostos via useMagic().
 */

import {
  requestValidationMiddleware,
  responseValidationMiddleware,
} from '@/middlewares/validation.middleware';
import {
  authenticationMiddleware,
  AuthenticationConfig,
} from '@/middlewares/authentication.middleware';
import { getLoggerNoAsync } from '@/plugins/pino.plugin';
import { getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from '@asteasolutions/zod-to-openapi';
import Router from '@koa/router';
import { Context, Next } from 'koa';
import pino from 'pino';
import { registry } from '../../domains/swagger/openApiGenerator';

// Method type (from zod-to-openapi RouteConfig)
export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | 'trace';

export type MagicRouteConfig<TContext extends Context = Context> =
  RouteConfig & {
    name: string;
    middlewares?: Array<(ctx: TContext, next: Next) => Promise<void>>;
    handlers: Array<(ctx: TContext, next: Next) => Promise<void>>;
    authentication?: AuthenticationConfig;
  };

export type MagicRouteConfigWithoutMethod<TContext extends Context = Context> =
  Omit<MagicRouteConfig<TContext>, 'method'>;

export class MagicRouter<TContext extends Context = Context> {
  private router: Router;

  private swaggerRoutes: Array<MagicRouteConfig<TContext>> = [];
  private childRouters: Array<{
    pathPrefix: string;
    router: MagicRouter<TContext>;
  }> = [];
  private basePath: string;
  private logger: pino.Logger;

  constructor(opts?: Router.RouterOptions) {
    this.router = new Router(opts);
    this.basePath = opts?.prefix || '';
    this.logger = getLoggerNoAsync();
  }

  private buildHandlers(config: MagicRouteConfig<TContext>) {
    const middlewares = config.middlewares || [];
    const requestValidation = requestValidationMiddleware<TContext>(config);
    const responseValidation = responseValidationMiddleware<TContext>(config);

    // Autenticação (qualquer método válido)
    const authenticationMiddlewares = [];
    if (config.authentication) {
      authenticationMiddlewares.push(
        authenticationMiddleware(config.authentication)
      );
    }

    // Wrapper apenas no último handler para chamar next()
    const handlers = [...config.handlers];
    const lastHandler = handlers.pop();

    const wrappedLastHandler = async (ctx: TContext, next: Next) => {
      await lastHandler!(ctx, async () => {});
      await next(); // Chama o responseValidation
    };

    return [
      requestValidation,
      ...authenticationMiddlewares,
      ...middlewares,
      ...handlers,
      wrappedLastHandler,
      responseValidation,
    ];
  }

  private convertPath(path: string): string {
    // Converte path OpenAPI {param} para Koa :param
    return path.replace(/\{(\w+)\}/g, ':$1');
  }

  useMagic(
    pathPrefixOrRouter: string | MagicRouter<TContext>,
    router?: MagicRouter<TContext>
  ): this {
    if (typeof pathPrefixOrRouter === 'string' && router) {
      this.router.use(
        pathPrefixOrRouter,
        router.routes(),
        router.allowedMethods()
      );
      this.childRouters.push({ pathPrefix: pathPrefixOrRouter, router });
    } else if (pathPrefixOrRouter instanceof MagicRouter) {
      this.router.use(
        pathPrefixOrRouter.routes(),
        pathPrefixOrRouter.allowedMethods()
      );
      this.childRouters.push({ pathPrefix: '', router: pathPrefixOrRouter });
    }
    return this;
  }

  getSwaggerRoutes(): MagicRouteConfig<TContext>[] {
    return this.swaggerRoutes;
  }

  registryAll(parentPrefix: string = ''): void {
    const fullPrefix = parentPrefix + this.basePath;

    // Registra rotas próprias
    this.swaggerRoutes.forEach((route) => {
      const routeConfig: RouteConfig = {
        ...route,
        path: fullPrefix + route.path,
      };

      // Adiciona security se authentication está configurado
      if (route.authentication) {
        const hasJwt =
          route.authentication.someOneMethod ||
          route.authentication.onlyMethods?.jwt;
        if (hasJwt) {
          routeConfig.security = [{ bearerAuth: [] }];
        }
      }

      if (getEnvValue(EnvKey.NODE_ENV) === 'development') {
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

  // Usado em: koaServer.plugin.ts (logRoutesDetailed)
  getInternalRouter() {
    return this.router;
  }

  // HTTP Methods
  get(config: MagicRouteConfigWithoutMethod<TContext>): this {
    const configLocal = { ...config, method: 'get' as Method };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.get(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal);
    return this;
  }

  post(config: MagicRouteConfigWithoutMethod<TContext>): this {
    const configLocal = { ...config, method: 'post' as Method };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.post(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal);
    return this;
  }

  put(config: MagicRouteConfigWithoutMethod<TContext>): this {
    const configLocal = { ...config, method: 'put' as Method };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.put(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal);
    return this;
  }

  delete(config: MagicRouteConfigWithoutMethod<TContext>): this {
    const configLocal = { ...config, method: 'delete' as Method };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.delete(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal);
    return this;
  }

  patch(config: MagicRouteConfigWithoutMethod<TContext>): this {
    const configLocal = { ...config, method: 'patch' as Method };
    const allHandlers = this.buildHandlers(configLocal);
    const koaPath = this.convertPath(configLocal.path);
    this.router.patch(koaPath, ...allHandlers);
    this.swaggerRoutes.push(configLocal);
    return this;
  }
}
