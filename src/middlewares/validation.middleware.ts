import { Context, Next } from 'koa';
import { MagicRouteConfig } from '@/utils/core/MagicRouter';

export const createValidationMiddleware = (config: MagicRouteConfig) => {
  return async (ctx: Context, next: Next) => {
    const { request } = config;

    if (!request) {
      return await next();
    }

    // Valida params
    if (request.params) {
      ctx.params = request.params.parse(ctx.params);
    }

    // Valida query
    if (request.query) {
      ctx.query = request.query.parse(ctx.query) as any;
    }

    // Valida body
    if (request.body?.content?.['application/json']?.schema) {
      const bodySchema = request.body.content['application/json'].schema;
      if ('parse' in bodySchema) {
        ctx.request.body = bodySchema.parse(ctx.request.body);
      }
    }

    // Valida cookies
    if (request.cookies) {
      ctx.cookies = request.cookies.parse(ctx.cookies) as any;
    }

    // Valida headers
    if (request.headers && !Array.isArray(request.headers)) {
      ctx.headers = request.headers.parse(ctx.headers) as any;
    }

    await next();
  };
};
