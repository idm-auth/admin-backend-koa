// config.routes.ts

import { MagicRouter } from '@/utils/core/MagicRouter';
import * as configController from '@/domains/config/v1/config.controller';
import { configParamsSchema } from '@/domains/config/latest/config.schema';
import { Context } from 'koa';
import { ConfigParams } from '@/domains/config/latest/config.schema';

type ConfigContext = Context & { params: ConfigParams };

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/v1',
  });
  router.get<ConfigContext>({
    name: 'getConfig',
    path: '/app/:appName/env/:env',
    handlers: [configController.getConfig],
    request: {
      params: configParamsSchema,
    },
    responses: {
      200: {
        description: 'Application configuration',
      },
    },
    tags: ['Config'],
  });

  return router;
};
