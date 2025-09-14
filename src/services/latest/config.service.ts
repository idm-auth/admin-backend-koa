import { WebAdminConfigModel } from '@/models/db/core/config/webAdminConfig.v1.model';
import {
  WebAdminConfig as WebAdminConfigResponse,
  webAdminConfigZSchema,
  EnvConfig,
} from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';
import { getLogger } from '@/utils/localStorage.util';

export type GetConfigArgs = { app: string; env: EnvConfig };
export type GetWebAdminConfigReturn = Promise<WebAdminConfigResponse | null>;

const getWebAdminConfig = async (
  args: GetConfigArgs
): GetWebAdminConfigReturn => {
  const logger = getLogger();

  const model = await WebAdminConfigModel.findOne({
    app: args.app,
    env: args.env,
  });
  logger.info({
    msg: `model: ${JSON.stringify(model)}`,
  });

  // 1. Converter para objeto plain
  if (!model) return null; // já lida com não encontrado
  const plainObject = model.toObject(); // método oficial do Mongoose

  // 2. Validar/parsear com Zod
  const result = webAdminConfigZSchema.parse(plainObject);

  return result;
};

export default { getWebAdminConfig };
