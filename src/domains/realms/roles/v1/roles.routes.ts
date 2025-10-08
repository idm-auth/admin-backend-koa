import { MagicRouter } from '@/utils/core/MagicRouter';
import * as roles from '@/domains/realms/roles/latest/roles.routes';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const rolesRouter = await roles.initialize();
  router.useMagic('', rolesRouter);

  return router;
};