import { Context } from 'koa';
import * as authenticationService from './authentication.service';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'authentication.controller';

export const login = async (ctx: Context) => {
  const tenantId = ctx.validated.params.tenantId;
  const { email } = ctx.validated.body;

  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.login`,
      attributes: {
        'tenant.id': tenantId,
        'account.email': email,
        operation: 'login',
        'http.method': 'POST',
      },
    },
    async () => {
      const logger = await getLogger();

      try {
        const result = await authenticationService.login(
          tenantId,
          ctx.validated.body
        );

        ctx.status = 200;
        ctx.body = result;
      } catch (error: unknown) {
        logger.error(error, 'Error during login');
        throw error;
      }
    }
  );
};

export const assumeRole = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.assumeRole`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'http.method': 'POST',
        operation: 'assumeRole',
      },
    },
    async (span) => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;
      const sourceAccountId = ctx.state.user!.accountId;

      span.setAttributes({ 'account.id': sourceAccountId });

      logger.info(
        {
          tenantId,
          sourceAccountId,
          targetRealmId: ctx.validated.body.targetRealmId,
        },
        'Processing assume role request'
      );

      const result = await authenticationService.assumeRole(
        tenantId,
        sourceAccountId,
        ctx.validated.body
      );

      logger.info(
        {
          tenantId,
          sourceAccountId,
          targetRealmId: ctx.validated.body.targetRealmId,
        },
        'Assume role completed successfully'
      );

      ctx.status = 200;
      ctx.body = result;
    }
  );
};

export const refresh = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.refresh`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'http.method': 'POST',
        operation: 'refresh',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;
      const { refreshToken } = ctx.validated.body;

      logger.info({ tenantId }, 'Processing refresh token request');

      const result = await authenticationService.refresh(
        tenantId,
        refreshToken
      );

      logger.info({ tenantId }, 'Refresh token completed successfully');

      ctx.status = 200;
      ctx.body = result;
    }
  );
};
