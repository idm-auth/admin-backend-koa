import * as groups from '@/domains/realms/groups/latest/groups.routes';
import { MagicRouter } from '@/domains/swagger/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const groupsRouter = await groups.initialize();
  router.useMagicRouter(groupsRouter);

  return router;
};
