import { Context, Next } from 'koa';
import { MagicRouteConfig } from '@/utils/core/MagicRouter';

export const requestValidationMiddleware = <TContext extends Context = Context>(
  config: MagicRouteConfig<TContext>
) => {
  return async (ctx: Context, next: Next) => {
    const { request } = config;

    if (!request) {
      return await next();
    }

    // Valida params
    if (request.params) {
      await request.params.parseAsync(ctx.params);
    }

    // Valida query
    if (request.query) {
      await request.query.parseAsync(ctx.query);
    }

    // Valida body
    if (request.body?.content?.['application/json']?.schema) {
      const bodySchema = request.body.content['application/json'].schema;
      if ('parseAsync' in bodySchema) {
        await bodySchema.parseAsync(ctx.request.body);
      }
    }

    // Valida cookies
    if (request.cookies) {
      await request.cookies.parseAsync(ctx.cookies);
    }

    // Valida headers
    if (request.headers && !Array.isArray(request.headers)) {
      await request.headers.parseAsync(ctx.headers);
    }

    await next();
  };
};

export const responseValidationMiddleware = <
  TContext extends Context = Context,
>(
  config: MagicRouteConfig<TContext>
) => {
  return async (ctx: Context, next: Next) => {
    await next();

    const { responses } = config;
    if (!responses) return;

    const statusCode = String(ctx.status);
    const responseConfig = responses[statusCode];

    if (!responseConfig || 'content' in responseConfig === false) return;

    const schema = responseConfig.content?.['application/json']?.schema;
    if (schema && 'parse' in schema) {
      ctx.body = schema.parse(ctx.body);
    }
  };
};
