import Router from '@koa/router';
import { registry } from './openApiGenerator';
import { MagicRouteConfig } from './routerConfig.schema';

export class MagicRouter extends Router {
  private swaggerRoutes: MagicRouteConfig[] = [];
  private childRouters: Array<{ pathPrefix: string; router: MagicRouter }> = [];
  private basePath: string;

  constructor(opts?: Router.RouterOptions) {
    super(opts);
    this.basePath = opts?.prefix || '';
  }

  addRoute(config: MagicRouteConfig): this {
    // Adiciona a rota no Koa Router
    const method = config.method.toLowerCase() as keyof Router;
    const routerMethod = this[method] as Function;

    if (routerMethod) {
      const middlewares = config.middlewares || [];
      const allHandlers = [...middlewares, ...config.handlers];
      routerMethod.call(this, config.path, ...allHandlers);
    }

    // Armazena configuração sem registrar ainda
    this.swaggerRoutes.push(config);

    return this;
  }

  useMagicRouter(
    pathPrefixOrRouter: string | MagicRouter,
    router?: MagicRouter
  ): this {
    if (typeof pathPrefixOrRouter === 'string' && router) {
      // useMagicRouter('/path', router)
      super.use(pathPrefixOrRouter, router.routes(), router.allowedMethods());
      this.childRouters.push({ pathPrefix: pathPrefixOrRouter, router });
    } else if (pathPrefixOrRouter instanceof MagicRouter) {
      // useMagicRouter(router)
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
      registry.registerPath({
        ...route,
        path: fullPrefix + route.path,
      });
    });

    // Chama registryAll nos routers filhos
    this.childRouters.forEach(({ pathPrefix, router }) => {
      router.registryAll(fullPrefix + pathPrefix);
    });
  }
}
