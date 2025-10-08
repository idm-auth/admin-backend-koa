// config.routes.ts

import { MagicRouter } from '@/utils/core/MagicRouter';
import * as configController from '@/domains/config/v1/config.controller';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  router.get('/app/:appName/env/:env', configController.getConfig);

  return router;
};
