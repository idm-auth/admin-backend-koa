import * as config from '@/domains/config/config.routes';

import * as realms from '@/domains/realms/realms.routes';
import { MagicRouter } from '../utils/core/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/api',
  });
  const configRouter = await config.initialize();

  const realmsRouter = await realms.initialize();

  router.useMagic(configRouter);

  router.useMagic(realmsRouter);

  return router;
};

export default { initialize };
