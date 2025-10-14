import { MagicRouter } from '@/utils/core/MagicRouter';
import * as latestRoutes from '@/domains/realms/account-roles/latest/account-roles.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/v1' });
  const latestRouter = await latestRoutes.initialize();

  router.useMagic('', latestRouter);

  return router;
};
