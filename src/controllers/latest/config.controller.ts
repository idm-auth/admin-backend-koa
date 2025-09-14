import service from '@/services/latest/config.service';
import { Context } from 'koa';
import type { EnvConfig } from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';

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

export default { getConfig };
