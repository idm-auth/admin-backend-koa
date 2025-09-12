import type {
  EnvConfig,
  WebAdminConfig,
} from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';

import { getLogger, getRequestId } from '@/utils/localStorage.util';
import { WebAdminConfigModel } from '@/models/config/webAdminConfig.v1.model';

const getConfig = async (args: { app: string; env: EnvConfig }) => {
  const logger = getLogger();
  const requestId = getRequestId();
  const result = await WebAdminConfigModel.findOne({
    name: args.app,
    env: args.env,
  }).lean();
  logger.info({
    msg: `result: ${JSON.stringify(result)}`,
  });

  return result;
};

export default { getConfig };
