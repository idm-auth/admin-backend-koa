import { Context, Next } from 'koa';
import { UnauthorizedError } from '@/errors/unauthorized';
import * as jwtService from '@/domains/realms/jwt/jwt.service';
import { JwtPayload } from '@/domains/realms/jwt/jwt.schema';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';

const MIDDLEWARE_NAME = 'authentication.middleware';

/**
 * Authentication configuration for routes
 *
 * @property someOneMethod - Accept any available authentication method (tries JWT, then API Key)
 * @property onlyMethods - Accept only specific authentication methods
 * @property onlyMethods.jwt - Accept JWT authentication
 * @property onlyMethods.apiKey - Accept API Key authentication
 *
 * @example
 * // Accept any method
 * authentication: { someOneMethod: true }
 *
 * @example
 * // Accept only JWT
 * authentication: { onlyMethods: { jwt: true } }
 *
 * @example
 * // Accept JWT or API Key
 * authentication: { onlyMethods: { jwt: true, apiKey: true } }
 */
export type AuthenticationConfig = {
  someOneMethod?: boolean;
  onlyMethods?: { jwt?: boolean; apiKey?: boolean };
};

export const authenticationMiddleware = (config: AuthenticationConfig) => {
  return async (ctx: Context, next: Next) => {
    return withSpanAsync(
      {
        name: `${MIDDLEWARE_NAME}.authenticate`,
        attributes: {
          'auth.methods': Object.keys(config)
            .filter((k) => config[k as keyof AuthenticationConfig])
            .join(','),
          operation: 'authenticate',
        },
      },
      async (span) => {
        const methods = [];

        if (config.someOneMethod) {
          methods.push(tryJwtAuth, tryApiKeyAuth);
        } else if (config.onlyMethods) {
          if (config.onlyMethods.jwt) methods.push(tryJwtAuth);
          if (config.onlyMethods.apiKey) methods.push(tryApiKeyAuth);
        }

        let authenticated = false;
        let lastError: Error | null = null;

        for (const method of methods) {
          try {
            await method(ctx);
            authenticated = true;
            span.setAttributes({ 'auth.success': true });
            break;
          } catch (error) {
            lastError = error as Error;
            continue;
          }
        }

        if (!authenticated) {
          span.setAttributes({ 'auth.success': false });
          throw new UnauthorizedError('Authentication failed for all methods', {
            cause: lastError,
          });
        }

        await next();
      }
    );
  };
};

const tryJwtAuth = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${MIDDLEWARE_NAME}.tryJwtAuth`,
      attributes: { 'auth.method': 'jwt' },
    },
    async (span) => {
      const logger = await getLogger();
      const token = extractBearerToken(ctx);
      const tenantId = ctx.validated?.params?.tenantId || ctx.params?.tenantId;

      if (!tenantId) {
        throw new UnauthorizedError('Tenant ID not found in request');
      }

      span.setAttributes({ 'tenant.id': tenantId });

      const decoded = await jwtService.verifyToken(tenantId, token);
      const payload = decoded as JwtPayload;

      ctx.state.tenantId = tenantId;
      ctx.state.user = {
        accountId: payload.accountId,
      };

      span.setAttributes({
        'account.id': payload.accountId,
        'account.email': payload.email,
      });

      logger.debug(
        { tenantId, accountId: payload.accountId, email: payload.email },
        'JWT authentication successful'
      );
    }
  );
};

const extractBearerToken = (ctx: Context): string => {
  const authHeader = ctx.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Authorization header missing');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Invalid authorization header format');
  }

  const token = parts[1];

  if (!token) {
    throw new UnauthorizedError('Token missing in authorization header');
  }

  return token;
};

const tryApiKeyAuth = async (ctx: Context) => {
  // TODO: Implementar validação API Key
  throw new Error('API Key authentication not implemented yet');
};
