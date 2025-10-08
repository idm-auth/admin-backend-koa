import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
  RouteConfig as ZodRouteConfig,
} from '@asteasolutions/zod-to-openapi';
import Router from '@koa/router';
import { Context, Next } from 'koa';
import { z } from 'zod';

extendZodWithOpenApi(z);

export interface RouteConfig extends ZodRouteConfig {
  name: string;
  middlewares?: Array<(ctx: Context, next: Next) => Promise<void>>;
  handlers: Array<(ctx: Context, next: Next) => Promise<void>>;
}

let registry = new OpenAPIRegistry();

const addRoute = (router: Router, config: RouteConfig) => {
  // Registra no OpenAPI
  const obj: RouteConfig = {
    ...config,
  };
  registry.registerPath(obj);

  // // Cria middleware de validação
  // const validationMiddleware = this.createValidationMiddleware(
  //   config.validate
  // );

  // Registra no Koa Router
  switch (config.method) {
    case 'get':
      router.get(
        config.path,
        ...(config.middlewares || []),
        ...config.handlers
      );
      break;
    case 'post':
      router.post(
        config.path,
        ...(config.middlewares || []),
        ...config.handlers
      );
      break;
    case 'put':
      router.put(
        config.path,
        ...(config.middlewares || []),
        ...config.handlers
      );
      break;
    case 'delete':
      router.delete(
        config.path,
        ...(config.middlewares || []),
        ...config.handlers
      );
      break;
    case 'patch':
      router.patch(
        config.path,
        ...(config.middlewares || []),
        ...config.handlers
      );
      break;
  }
};

export const magicRouter = (options?: Router.RouterOptions) => {
  const router = new Router(options);

  return {
    addRoute: (config: RouteConfig) => addRoute(router, config),
    getKoaRouter: () => router,
  };
};

export class SwaggerRouter {
  private router: Router;
  private routeConfigs: RouteConfig[] = [];

  constructor(options?: Router.RouterOptions) {
    this.router = new Router(options);
  }

  addRoute(config: RouteConfig) {
    this.routeConfigs.push(config);

    // Registra no OpenAPI
    this.registerInSwagger(config);

    // // Cria middleware de validação
    // const validationMiddleware = this.createValidationMiddleware(
    //   config.validate
    // );

    // Registra no Koa Router
    switch (config.method) {
      case 'get':
        this.router.get(
          config.path,
          ...(config.middlewares || []),
          ...config.handlers
        );
        break;
      case 'post':
        this.router.post(
          config.path,
          ...(config.middlewares || []),
          ...config.handlers
        );
        break;
      case 'put':
        this.router.put(
          config.path,
          ...(config.middlewares || []),
          ...config.handlers
        );
        break;
      case 'delete':
        this.router.delete(
          config.path,
          ...(config.middlewares || []),
          ...config.handlers
        );
        break;
      case 'patch':
        this.router.patch(
          config.path,
          ...(config.middlewares || []),
          ...config.handlers
        );
        break;
    }

    return this;
  }

  private registerInSwagger(config: RouteConfig) {
    // const { validate, path, method, tags = [] } = config;

    // const requestBody = validate?.body
    //   ? {
    //       content: { 'application/json': { schema: validate.body } },
    //     }
    //   : undefined;

    // const parameters: Array<{
    //   name: string;
    //   in: 'path' | 'query';
    //   required?: boolean;
    //   schema: { type: string };
    // }> = [];
    // if (validate?.params) {
    //   const paramNames = path.match(/:(\w+)/g)?.map((p) => p.slice(1)) || [];
    //   paramNames.forEach((name) => {
    //     parameters.push({
    //       name,
    //       in: 'path' as const,
    //       required: true,
    //       schema: { type: 'string' },
    //     });
    //   });
    // }

    // if (validate?.query) {
    //   Object.keys((validate.query as any).shape || {}).forEach((name) => {
    //     parameters.push({
    //       name,
    //       in: 'query' as const,
    //       schema: { type: 'string' },
    //     });
    //   });
    // }

    // const responses: Record<string, any> = {};

    // if (validate?.response) {
    //   responses['200'] = {
    //     content: { 'application/json': { schema: validate.response } },
    //   };
    // }

    // if (validate?.responses) {
    //   Object.entries(validate.responses).forEach(([status, schema]) => {
    //     if (schema) {
    //       responses[status] = {
    //         content: { 'application/json': { schema } },
    //       };
    //     }
    //   });
    // }

    // if (!responses['200']) {
    //   responses['200'] = { description: 'Success' };
    // }
    const obj: RouteConfig = {
      ...config,
    };
    registry.registerPath(obj);
  }

  // private createValidationMiddleware(validate?: RouteConfig['validate']) {
  //   return async (ctx: Context, next: Next) => {
  //     if (validate) {
  //       // Preserva parâmetros existentes do router pai
  //       const existingParams = { ...ctx.params };

  //       // Valida params
  //       if (validate.params) {
  //         ctx.params = validate.params.parse(ctx.params);
  //       }

  //       // Valida query
  //       if (validate.query) {
  //         ctx.query = validate.query.parse(ctx.query) as any;
  //       }

  //       // Valida body
  //       if (validate.body) {
  //         ctx.request.body = validate.body.parse(ctx.request.body);
  //       }
  //     }

  //     await next();

  //     // Valida response após execução
  //     if (validate?.response) {
  //       ctx.body = validate.response.parse(ctx.body);
  //     } else if (validate?.responses?.[ctx.status]) {
  //       ctx.body = validate.responses[ctx.status].parse(ctx.body);
  //     }
  //   };
  // }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }

  private convertPathToOpenAPI(path: string): string {
    return path.replace(/:(\w+)/g, '{$1}');
  }

  private extractTagFromPath(path: string): string {
    const segments = path.split('/').filter(Boolean);
    return segments[0] || 'default';
  }
}

export const getOpenAPIDocument = () => {
  console.log(JSON.stringify(registry.definitions));

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Swagger POC API',
      version: '1.0.0',
      description: 'API documentation generated from Zod schemas',
    },
  });
};
