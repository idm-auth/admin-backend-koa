import { MagicRouter } from '@/utils/core/MagicRouter';
import * as authenticationController from './authentication.controller';
import {
  loginRequestSchema,
  loginResponseSchema,
} from './authentication.schema';
import { errorResponseSchema } from '@/domains/commons/base/latest/base.schema';
import { requestTenantIdParamsSchema } from '@/domains/commons/base/latest/request.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/authentication' });

  router.post({
    name: 'login',
    path: '/login',
    summary: 'User login',
    handlers: [authenticationController.login],
    request: {
      params: requestTenantIdParamsSchema,
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
