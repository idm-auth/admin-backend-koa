import { validateZod } from '@/domains/commons/validations/latest/validation.service';
import { MagicRouteConfig } from '@/utils/core/MagicRouter';
import { getLogger } from '@/utils/localStorage.util';
import { Context, Next } from 'koa';
import { z } from 'zod';
export const requestValidationMiddleware = <TContext extends Context = Context>(
  config: MagicRouteConfig<TContext>
) => {
  return async (ctx: Context, next: Next) => {
    const logger = await getLogger();
    const { request } = config;

    logger.debug(
      {
        method: ctx.method,
        url: ctx.url,
        routeName: config.name,
        hasRequest: !!request,
      },
      'Request validation middleware started'
    );

    // Inicializa ctx.validated
    ctx.validated = {};

    if (!request) {
      logger.debug('No request validation config, skipping');
      return await next();
    }

    // Valida params
    if (request.params) {
      logger.debug({ params: ctx.params }, 'Validating params');
      ctx.validated.params = await validateZod(ctx.params, request.params);
      logger.debug('Params validation successful');
    }

    // Valida query
    if (request.query) {
      logger.debug({ query: ctx.query }, 'Validating query');
      ctx.validated.query = await validateZod(ctx.query, request.query);
      logger.debug('Query validation successful');
    }

    // Valida body
    if (request.body?.content?.['application/json']?.schema) {
      const bodySchema = request.body.content['application/json']
        .schema as z.ZodSchema;

      logger.debug(
        {
          hasBodySchema: true,
          bodyRequired: request.body.required,
          requestBody: ctx.request.body,
          bodyType: typeof ctx.request.body,
          schemaType: bodySchema.constructor.name,
          schemaDescription: bodySchema.description || 'No description',
        },
        'Validating body'
      );

      const bodyData = ctx.request.body || {};
      ctx.validated.body = await validateZod(bodyData, bodySchema);
      logger.debug('Body validation successful');
    }

    // Valida cookies
    if (request.cookies) {
      logger.debug({ cookies: ctx.cookies }, 'Validating cookies');
      ctx.validated.cookies = await validateZod(ctx.cookies, request.cookies);
      logger.debug('Cookies validation successful');
    }

    logger.debug('Request validation middleware completed');
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
