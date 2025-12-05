import { getModel, WebAdminConfig } from './webAdminConfig.model';
import {
  EnvConfig,
  envConfigZSchema,
  WebAdminConfigResponse,
  webAdminConfigZSchema,
} from '@/domains/commons/base/webAdminConfig.schema';
import { getLogger } from '@/utils/localStorage.util';
import * as realmService from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';

export const getWebAdminConfig = async (args: {
  app: string;
  env: EnvConfig;
}): Promise<WebAdminConfigResponse> => {
  const logger = await getLogger();

  logger.debug({
    app: args.app,
    env: args.env,
  });

  const doc = await getModel().findOne({
    app: args.app,
    env: args.env,
  });
  logger.info({
    msg: `model: ${JSON.stringify(doc)}`,
  });

  if (!doc) throw new NotFoundError('Web admin config not found');
  const result = webAdminConfigZSchema.parse(doc);

  return result;
};

/**
 * Initial Setup - Database Seeding
 * 
 * This function is called by the frontend via /config/init-setup endpoint
 * on the first application startup when the database is empty.
 * 
 * It creates all essential initial data required for the application to function:
 * - Core realm (tenant context)
 * - Web admin configuration
 * - TODO: Initial admin account (first user)
 * - TODO: Default roles (admin, user, etc)
 * - TODO: Basic policies (permission definitions)
 * - TODO: Default groups (organizational structure)
 * - TODO: Other essential configurations
 * 
 * The function is idempotent - it can be called multiple times safely.
 * If data already exists, it returns status 200 without creating duplicates.
 */
export const initSetup = async () => {
  const logger = await getLogger();
  const base = {
    app: 'web-admin',
    env: getEnvValue(EnvKey.NODE_ENV),
  };
  const doc = await getModel().findOne(base);
  if (!doc) {
    const realmCore = await realmService.initSetup();
    const config: WebAdminConfig = {
      app: base.app,
      env: envConfigZSchema.parse(base.env),
      api: {
        main: {
          url: getEnvValue(EnvKey.API_MAIN_URL),
        },
      },
      coreRealm: {
        publicUUID: realmCore.publicUUID,
      },
    };
    logger.debug(config);
    await getModel().create(config);

    return { status: 201 };
  } else {
    return { status: 200 };
  }
};
