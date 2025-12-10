import { MagicRouter } from '@/utils/core/MagicRouter';
import * as configController from './config.controller';
import { configParamsSchema, initSetupSchema } from './config.schema';

export const initialize = async () => {
  const router = new MagicRouter({
    prefix: '/config',
  });

  router.post({
    name: 'getInitSetup',
    path: '/init-setup',
    handlers: [configController.getInitSetup],
    request: {
      body: {
        content: {
          'application/json': {
            schema: initSetupSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Init setup configuration',
      },
    },
    tags: ['Config'],
  });

  // TODO: só fazer se for JWT Admin
  router.post({
    name: 'repairDefaultSetup',
    path: '/repair-default-setup',
    handlers: [configController.repairDefaultSetup],
    responses: {
      200: {
        description: 'Default setup repaired successfully',
      },
    },
    tags: ['Config'],
  });

  router.get({
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
