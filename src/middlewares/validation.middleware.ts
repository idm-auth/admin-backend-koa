import { validateZod } from '@/domains/commons/validations/latest/validation.service';
import { MagicRouteConfig } from '@/utils/core/MagicRouter';
import { getLogger } from '@/utils/localStorage.util';
import { Context, Next } from 'koa';
import { z } from 'zod';
export const requestValidationMiddleware = <TContext extends Context = Context>(
  config: MagicRouteConfig<TContext>
) => {
  return async (ctx: Context, next: Next) => {
    const { request } = config;

    // Inicializa ctx.validated
    ctx.validated = {};

    if (!request) {
      return await next();
    }

    // Valida params
    if (request.params) {
      ctx.validated.params = await validateZod(ctx.params, request.params);
    }

    // Valida query
    if (request.query) {
      ctx.validated.query = await validateZod(ctx.query, request.query);
    }

    // Valida body
    if (request.body?.content?.['application/json']?.schema) {
      const bodySchema = request.body.content['application/json']
        .schema as z.ZodSchema;
      ctx.validated.body = await validateZod(ctx.request.body, bodySchema);
    }

    // Valida cookies
    if (request.cookies) {
      ctx.validated.cookies = await validateZod(ctx.cookies, request.cookies);
    }

    // // Valida headers
    // if (request.headers && Array.isArray(request.headers)) {
    //   ctx.parsed.headers = await request.headers.parseAsync(ctx.headers);
    // }

    await next();
  };
};

export const responseValidationMiddleware = <
  TContext extends Context = Context,
>(
  config: MagicRouteConfig<TContext>
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (ctx: Context, next: Next) => {
    const logger = await getLogger();

    logger.info(
      `Response validation - Status: ${ctx.status}, Route: ${config.name}`
    );

    const { responses } = config;
    if (!responses) {
      logger.debug('No response schemas defined');
      return;
    }

    const statusCode = String(ctx.status);
    const responseConfig = responses[statusCode];

    if (!responseConfig || !('content' in responseConfig)) {
      logger.debug(`No schema for status ${statusCode}`);
      return;
    }

    const schema = responseConfig.content?.['application/json']
      ?.schema as z.ZodSchema;

    if (schema) {
      logger.debug('Validating response body');
      try {
        ctx.body = await validateZod(ctx.body, schema);
        logger.info('Response validation successful');
      } catch (error) {
        logger.error(error, 'Response validation failed - Backend error');
        logger.error(ctx.body, 'Response body');
        ctx.status = 500;
        ctx.body = {
          error: 'Internal Server Error',
          details: 'Backend failed to generate expected response format',
        };
      }
    }
  };
};
