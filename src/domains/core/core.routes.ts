import { MagicRouter } from '@/utils/core/MagicRouter';
import * as realms from './realms/realm.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/core' });

  const realmsRouter = await realms.initialize();

  router.useMagic(realmsRouter);

  return router;
};
