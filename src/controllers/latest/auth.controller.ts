import { Context } from 'koa';
import * as authService from '@/services/latest/auth.service';
import { loginRequestZSchema } from '@/schemas/auth/v1/login/request';
import { getLogger } from '@/utils/localStorage.util';

export const login = async (ctx: Context) => {
  const logger = await getLogger();

  try {
    const body = loginRequestZSchema.parse(ctx.request.body);
    const tenantId = ctx.params.tenantId;
    const result = await authService.login(tenantId, body);

    ctx.status = 200;
    ctx.body = result;
  } catch (error: unknown) {
    logger.error(error, 'Error during login');
    ctx.status = 400;
    ctx.body = { error: 'Invalid request' };
  }
};
