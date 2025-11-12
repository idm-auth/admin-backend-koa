import { Context } from 'koa';
import * as authenticationService from './authentication.service';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (ctx: Context) => {
  const logger = await getLogger();

  try {
    const tenantId = ctx.validated.params.tenantId;
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
};