import * as accounts from '@/domains/realms/accounts/latest/accounts.routes';
import { MagicRouter } from '@/domains/swagger/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const accountsRouter = await accounts.initialize();
  router.useMagicRouter(accountsRouter);

  return router;
};
