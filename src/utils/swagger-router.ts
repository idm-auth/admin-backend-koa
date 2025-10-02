import Router from '@koa/router';
import { Context, Next } from 'koa';
import { ZodSchema, z } from 'zod';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

interface RouteConfig {
  name: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  middlewares?: Array<(ctx: Context, next: Next) => Promise<void>>;
  handlers: Array<(ctx: Context, next: Next) => Promise<void>>;
  validate?: {
    params?: ZodSchema;
    query?: ZodSchema;
    body?: ZodSchema;
    response?: ZodSchema;
    responses?: Record<number, ZodSchema>;
  };
  tags?: string[];
}

export class SwaggerRouter {
  private router: Router;
  private routeConfigs: RouteConfig[] = [];
  private registry: OpenAPIRegistry;

  constructor(options?: Router.RouterOptions) {
    this.router = new Router(options);
    this.registry = new OpenAPIRegistry();
  }

  addRoute(config: RouteConfig) {
    this.routeConfigs.push(config);
    
    // Registra no OpenAPI
    this.registerInSwagger(config);
    
    // Cria middleware de validação
    const validationMiddleware = this.createValidationMiddleware(config.validate);
    
    // Registra no Koa Router
    this.router[config.method](
      config.path,
      validationMiddleware,
      ...(config.middlewares || []),
      ...config.handlers
    );
    
    return this;
  }

  private registerInSwagger(config: RouteConfig) {
    const { validate, path, method, tags = [] } = config;
    
    const requestBody = validate?.body ? {
      content: { 'application/json': { schema: validate.body } }
    } : undefined;

    const parameters = [];
    if (validate?.params) {
      const paramNames = path.match(/:(\w+)/g)?.map(p => p.slice(1)) || [];
      paramNames.forEach(name => {
        parameters.push({
          name,
          in: 'path' as const,
          required: true,
          schema: { type: 'string' }
        });
      });
    }

    if (validate?.query) {
      Object.keys((validate.query as any).shape || {}).forEach(name => {
        parameters.push({
          name,
          in: 'query' as const,
          schema: { type: 'string' }
        });
      });
    }

    const responses: Record<string, any> = {};
    
    if (validate?.response) {
      responses['200'] = {
        content: { 'application/json': { schema: validate.response } }
      };
    }

    if (validate?.responses) {
      Object.entries(validate.responses).forEach(([status, schema]) => {
        responses[status] = {
          content: { 'application/json': { schema } }
        };
      });
    }

    if (!responses['200']) {
      responses['200'] = { description: 'Success' };
    }

    this.registry.registerPath({
      method: method as any,
      path: this.convertPathToOpenAPI(path),
      tags: tags.length ? tags : [this.extractTagFromPath(path)],
      parameters: parameters.length ? parameters : undefined,
      requestBody,
      responses
    });
  }

  private createValidationMiddleware(validate?: RouteConfig['validate']) {
    return async (ctx: Context, next: Next) => {
      if (validate) {
        // Valida params
        if (validate.params) {
          ctx.params = validate.params.parse(ctx.params);
        }
        
        // Valida query
        if (validate.query) {
          ctx.query = validate.query.parse(ctx.query) as any;
        }
        
        // Valida body
        if (validate.body) {
          ctx.request.body = validate.body.parse(ctx.request.body);
        }
      }

      await next();

      // Valida response após execução
      if (validate?.response) {
        ctx.body = validate.response.parse(ctx.body);
      } else if (validate?.responses?.[ctx.status]) {
        ctx.body = validate.responses[ctx.status].parse(ctx.body);
      }
    };
  }

  routes() {
    return this.router.routes();
  }

  allowedMethods() {
    return this.router.allowedMethods();
  }

  getOpenAPIDocument() {
    const generator = new OpenApiGeneratorV3(this.registry.definitions);
    return generator.generateDocument({
      openapi: '3.0.0',
      info: { 
        title: 'Swagger POC API', 
        version: '1.0.0',
        description: 'API documentation generated from Zod schemas'
      }
    });
  }

  private convertPathToOpenAPI(path: string): string {
    return path.replace(/:(\w+)/g, '{$1}');
  }

  private extractTagFromPath(path: string): string {
    const segments = path.split('/').filter(Boolean);
    return segments[0] || 'default';
  }
}