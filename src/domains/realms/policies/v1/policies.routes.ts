import { MagicRouter } from '@/utils/core/MagicRouter';
import * as policies from '@/domains/realms/policies/latest/policies.routes';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  const policiesRouter = await policies.initialize();
  router.useMagic(policiesRouter);

  return router;
};
