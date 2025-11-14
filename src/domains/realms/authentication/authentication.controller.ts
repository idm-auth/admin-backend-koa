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
