import * as config from '@/domains/config/config.routes';
import * as core from '@/domains/core/core.routes';
import * as realms from '@/domains/realms/realms.routes';
import { MagicRouter } from '../utils/core/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/api',
  });
  const configRouter = await config.initialize();
  const coreRouter = await core.initialize();
  const realmsRouter = await realms.initialize();

  router.useMagic(configRouter);
  router.useMagic(coreRouter);
  router.useMagic(realmsRouter);

  return router;
};

export default { initialize };
