import { Context, Next } from 'koa';
import { getLogger } from '@/utils/localStorage.util';
import { AuthorizationConfig } from '@/utils/core/MagicRouter';

/**
 * Build GRN (Global Resource Name) from request context
 *
 * Example:
 *   pathPattern: /api/realm/:tenantId/accounts/:id
 *   params: { tenantId: 'tenant-123', id: 'acc-456' }
 *   result: grn:global:iam-system::tenant-123:accounts/acc-456
 */
const buildGRN = (ctx: Context, config: AuthorizationConfig): string => {
  const { tenantId } = ctx.params;
  const systemId = config.systemId ?? 'iam-system';
  const resourceType = config.resource;

  // TODO: Extract resource-path from pathPattern and params
  // For now, use simple placeholder
  const resourcePath = resourceType.replace('realm.', '');

  return `grn:global:${systemId}::${tenantId}:${resourcePath}/*`;
};

export const authorizationMiddleware = (config: AuthorizationConfig) => {
  return async (ctx: Context, next: Next) => {
    const logger = await getLogger();

    const grn = buildGRN(ctx, config);

    // TODO: Implement authorization logic
    // 1. Get user policies from ctx.state.user
    // 2. Check if user has permission for action + resource (GRN)
    // 3. Throw ForbiddenError if not allowed

    logger.info(
      {
        systemId: config.systemId,
        operation: config.operation,
        resource: config.resource,
        pathPattern: ctx.state.pathPattern,
        grn,
      },
      'Authorization check'
    );

    await next();
  };
};
