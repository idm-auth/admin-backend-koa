// index.routes.ts
import * as configController from '@/domains/config/v1/config.controller';
import { MagicRouter } from '@/utils/core/MagicRouter';
import * as v1 from './v1/config.routes';
export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/config',
  });
  router.get({
    name: 'getInitSetup',
    path: '/init-setup',
    handlers: [configController.getInitSetup],
    responses: {
      200: {
        description: 'Init setup configuration',
      },
    },
    tags: ['Config'],
  });
  const v1Router = await v1.initialize();
  router.useMagic('', v1Router);

  return router;
};
