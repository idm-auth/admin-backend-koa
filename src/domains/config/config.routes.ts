import { MagicRouter } from '@/utils/core/MagicRouter';
import * as configController from './config.controller';
import { configParamsSchema, ConfigParams } from './config.schema';
import { Context } from 'koa';

type ConfigContext = Context & { params: ConfigParams };

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