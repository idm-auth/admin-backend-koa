import { EnvConfig } from '@/schemas/config/v1/webAdmin/response';
import service from '@/services/latest/config.service';
import { Context } from 'koa';

type Params = {
  env: EnvConfig;
  appName: string;
};

const getConfig = async (ctx: Context & { params: Params }) => {
  const { env, appName } = ctx.params;
  const webAdminConfig = await service.getWebAdminConfig({
    app: appName,
    env,
  });
  ctx.body = webAdminConfig;
};

const getInitSetup = async (ctx: Context) => {
  const result = await service.initSetup();
  ctx.body = result;
};

export default { getConfig, getInitSetup };
