import { WebAdminConfigModel } from '@/models/db/core/config/webAdminConfig.v1.model';
import {
  WebAdminConfig as WebAdminConfigResponse,
  webAdminConfigZSchema,
  EnvConfig,
} from '@/schemas/config/v1/webAdmin/response';
import { getLogger } from '@/utils/localStorage.util';

export type GetConfigArgs = { app: string; env: EnvConfig };
export type GetWebAdminConfigReturn = Promise<WebAdminConfigResponse | null>;

const getWebAdminConfig = async (
  args: GetConfigArgs
): GetWebAdminConfigReturn => {
  const logger = getLogger();

  const model = await WebAdminConfigModel();
  logger.debug({
    app: args.app,
    env: args.env,
  });

  const doc = await model.findOne({
    app: args.app,
    env: args.env,
  });
  logger.info({
    msg: `model: ${JSON.stringify(doc)}`,
  });

  // 1. Converter para objeto plain
  if (!doc) return null; // já lida com não encontrado
  const plainObject = doc.toObject(); // método oficial do Mongoose

  // 2. Validar/parsear com Zod
  const result = webAdminConfigZSchema.parse(plainObject);

  return result;
};

export const initSetup = async () => {
  const logger = getLogger();
  const model = await WebAdminConfigModel();
  const base = {
    app: 'web-admin',
    env: process.env.ENV_NAME || 'development',
  };
  const doc = await model.findOne(base);
  if (!doc) {
    const config = {
      ...base,
      api: {
        main: {
          url: process.env.API_MAIN_URL || 'http://locahost:3000',
        },
      },
    };
    logger.debug(config);
    await model.create(config);
    return { status: 201 };
  } else {
    return { status: 200 };
  }
};

export default { getWebAdminConfig, initSetup };
