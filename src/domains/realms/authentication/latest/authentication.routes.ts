import { MagicRouter } from '@/utils/core/MagicRouter';
import * as authenticationController from './authentication.controller';
import {
  loginRequestSchema,
  loginResponseSchema,
} from './authentication.schema';
import { errorResponseSchema } from '@/schemas/latest/base.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/authentication' });

  router.addRoute({
    name: 'login',
    method: 'post',
    path: '/login',
    summary: 'User login',
    handlers: [authenticationController.login],
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: loginResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Authentication'],
  });

  return router;
};
