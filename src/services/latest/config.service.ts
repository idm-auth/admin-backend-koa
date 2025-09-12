import type {
  EnvConfig,
  WebAdminConfig,
} from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';

import { getLogger, getRequestId } from '@/utils/localStorage.util';

const getConfig = async (args: { app: string; env: EnvConfig }) => {
  const logger = getLogger();
  const requestId = getRequestId();
  const result: WebAdminConfig = {
    app: args.app,
    env: args.env,
    api: {
      main: { url: '' },
    },
  };
  logger.info({
    msg: `result: ${JSON.stringify(result, null, 2)}`,
  });

  return result;
};

export default { getConfig };
