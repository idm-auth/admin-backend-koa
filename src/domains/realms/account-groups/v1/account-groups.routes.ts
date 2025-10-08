import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountGroups from '@/domains/realms/account-groups/latest/account-groups.routes';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const accountGroupsRouter = await accountGroups.initialize();
  router.useMagic('', accountGroupsRouter);

  return router;
};