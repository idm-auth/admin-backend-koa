import { Context } from 'koa';
import { getLogger } from '@/utils/localStorage.util';
import * as realmService from '@/domains/core/realms/realm.service';
import * as configService from './config.service';

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

/**
 * EXCEPTION TO ARCHITECTURE RULE: Business logic in controller
 *
 * This function intentionally retrieves tenantId from core realm service
 * instead of receiving it as a parameter. This is a documented exception
 * because:
 *
 * 1. repairDefaultSetup MUST operate on core realm only
 * 2. Forcing tenantId from core prevents accidental misuse on wrong tenant
 * 3. This is an administrative operation, not a regular tenant-scoped API
 * 4. Security: Ensures repair operations only affect the intended core realm
 *
 * This exception is acceptable because it enforces correctness and prevents
 * dangerous operations on wrong tenants.
 */
export const repairDefaultSetup = async (ctx: Context) => {
  const logger = await getLogger();

  // TODO: só fazer se for JWT Admin
  // TODO: pegar tenantId do JWT quando não for passado

  const coreRealm = await realmService.getRealmCore();
  const tenantId = coreRealm.publicUUID;
  logger.info({ tenantId }, 'Using core realm tenantId for repair operation');

  const result = await configService.repairDefaultSetup(tenantId);
  ctx.body = result;
};
