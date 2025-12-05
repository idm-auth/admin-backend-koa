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
  const data = ctx.validated.body;
  const result = await configService.initSetup(data);
  ctx.body = result;
};

export const repairDefaultSetup = async (ctx: Context) => {
  // TODO: só fazer se for JWT Admin
  // TODO: pegar tenantId do JWT quando não for passado
  const result = await configService.repairDefaultSetup(undefined);
  ctx.body = result;
};
