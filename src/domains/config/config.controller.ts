import * as configService from './config.service';
import { Context } from 'koa';

export const getConfig = async (ctx: Context) => {
  const { env, appName } = ctx.validated.params;
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
