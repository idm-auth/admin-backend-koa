import * as groups from '@/domains/realms/groups/latest/groups.routes';
import { MagicRouter } from '@/utils/core/MagicRouter';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const groupsRouter = await groups.initialize();
  router.useMagic(groupsRouter);

  return router;
};
