import type {
  EnvConfig,
  WebAdminConfig,
} from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';

import type { Context } from 'koa';

const getConfig = async (args: { app: string; env: EnvConfig }) => {
  const result: WebAdminConfig = {
    app: args.app,
    env: args.env,
    api: {
      main: { url: '' },
    },
  };
  return result;
};

export default { getConfig };
