import { Context } from 'koa';
import authService from '@/services/latest/auth.service';
import { loginRequestZSchema } from '@/schemas/auth/v1/login/request';
import { getLogger } from '@/utils/localStorage.util';

const login = async (ctx: Context) => {
  const logger = getLogger();

  try {
    const body = loginRequestZSchema.parse(ctx.request.body);
    const result = await authService.login(body);

    ctx.status = 200;
    ctx.body = result;
  } catch (error: unknown) {
    logger.error(error, 'Error during login');
    ctx.status = 400;
    ctx.body = { error: 'Invalid request' };
  }
};

export default { login };
