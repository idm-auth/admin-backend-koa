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

export const initSetup = async () => {
  const logger = await getLogger();
  const base = {
    app: 'web-admin',
    env: process.env.NODE_ENV || 'development',
  };
  const doc = await getModel().findOne(base);
  if (!doc) {
    const realmCore = await realmService.initSetup();
    const config: WebAdminConfig = {
      app: base.app,
      env: envConfigZSchema.parse(base.env),
      api: {
        main: {
          url: process.env.API_MAIN_URL || 'http://localhost:3000',
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
