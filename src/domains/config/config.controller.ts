import * as configService from './config.service';
import { Context } from 'koa';
import { ConfigParams } from './config.schema';

type ConfigContext = Context & { params: ConfigParams };

export const getConfig = async (ctx: ConfigContext) => {
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