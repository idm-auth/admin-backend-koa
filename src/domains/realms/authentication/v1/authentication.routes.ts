import { MagicRouter } from '@/utils/core/MagicRouter';
import * as authentication from '@/domains/realms/authentication/latest/authentication.routes';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const authenticationRouter = await authentication.initialize();
  router.useMagic('', authenticationRouter);

  return router;
};
