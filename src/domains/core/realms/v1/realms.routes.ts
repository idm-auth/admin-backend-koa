import * as realms from '@/domains/core/realms/latest/realms.routes';
import { MagicRouter } from '@/utils/core/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const realmsRouter = await realms.initialize();
  router.useMagic(realmsRouter);

  return router;
};
