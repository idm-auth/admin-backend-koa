import { getLoggerNoAsync } from '@/plugins/pino.plugin';
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from '@asteasolutions/zod-to-openapi';
import Router from '@koa/router';
import { Context, Next } from 'koa';
import { registry } from '../../domains/swagger/openApiGenerator';
import pino from 'pino';
import {
  requestValidationMiddleware,
  responseValidationMiddleware,
} from '@/middlewares/validation.middleware';

export type MagicRouteConfig = RouteConfig & {
  name: string;
  middlewares?: Array<(ctx: Context, next: Next) => Promise<void>>;
  handlers: Array<(ctx: Context, next: Next) => Promise<void>>;
};

export class MagicRouter extends Router {
  private swaggerRoutes: MagicRouteConfig[] = [];
  private childRouters: Array<{ pathPrefix: string; router: MagicRouter }> = [];
  private basePath: string;
  private logger: pino.Logger;

  constructor(opts?: Router.RouterOptions) {
    super(opts);
    this.basePath = opts?.prefix || '';
    this.logger = getLoggerNoAsync();
  }

  addRoute(config: MagicRouteConfig): this {
    const middlewares = config.middlewares || [];
    const requestValidation = requestValidationMiddleware(config);
    const responseValidation = responseValidationMiddleware(config);
    const allHandlers = [
      requestValidation,
      ...middlewares,
      ...config.handlers,
      responseValidation,
    ];

    // Converte path OpenAPI {param} para Koa :param
    const koaPath = config.path.replace(/\{(\w+)\}/g, ':$1');

    // Adiciona a rota no Koa Router
    switch (config.method.toLowerCase()) {
      case 'get':
        this.get(koaPath, ...allHandlers);
        break;
      case 'post':
        this.post(koaPath, ...allHandlers);
        break;
      case 'put':
        this.put(koaPath, ...allHandlers);
        break;
      case 'delete':
        this.delete(koaPath, ...allHandlers);
        break;
      case 'patch':
        this.patch(koaPath, ...allHandlers);
        break;
    }

    // Armazena configuração sem registrar ainda
    this.swaggerRoutes.push(config);

    return this;
  }

  useMagic(
    pathPrefixOrRouter: string | MagicRouter,
    router?: MagicRouter
  ): this {
    if (typeof pathPrefixOrRouter === 'string' && router) {
      // useMagic('/path', router)
      super.use(pathPrefixOrRouter, router.routes(), router.allowedMethods());
      this.childRouters.push({ pathPrefix: pathPrefixOrRouter, router });
    } else if (pathPrefixOrRouter instanceof MagicRouter) {
      // useMagic(router)
      super.use(
        pathPrefixOrRouter.routes(),
        pathPrefixOrRouter.allowedMethods()
      );
      this.childRouters.push({ pathPrefix: '', router: pathPrefixOrRouter });
    }
    return this;
  }

  getSwaggerRoutes(): MagicRouteConfig[] {
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
        try {
          const testRegistry = new OpenAPIRegistry();
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
}
