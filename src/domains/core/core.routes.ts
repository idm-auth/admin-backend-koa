import { MagicRouter } from '@/utils/core/MagicRouter';
import * as realms from './realms/realm.routes';
import * as applicationRegistries from './application-registries/application-registries.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/core' });

  const realmsRouter = await realms.initialize();
  const applicationRegistriesRouter = await applicationRegistries.initialize();

  router.useMagic(realmsRouter);
  router.useMagic(applicationRegistriesRouter);

  return router;
};
