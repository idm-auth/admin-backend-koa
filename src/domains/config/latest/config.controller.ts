import { EnvConfig } from '@/domains/commons/base/webAdminConfig.schema';
import * as configService from '@/domains/config/latest/config.service';
import { Context } from 'koa';

type Params = {
  env: EnvConfig;
  appName: string;
};

export const getConfig = async (ctx: Context & { params: Params }) => {
  const { env, appName } = ctx.params;
  const webAdminConfig = await configService.getWebAdminConfig({
    app: appName,
    env,
  });
  ctx.body = webAdminConfig;
};

export const getInitSetup = async (ctx: Context) => {
  const result = await configService.initSetup();
  ctx.body = result;
};
