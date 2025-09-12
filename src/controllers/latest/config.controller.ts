import service from '@/services/latest/config.service';
import { Context } from 'koa';

const getConfig = async (ctx: Context) => {
  const { env, appName } = ctx.params;
  const webAdminConfig = await service.getConfig({
    app: appName,
    env,
  });
  ctx.body = webAdminConfig;
};

export default { getConfig };
