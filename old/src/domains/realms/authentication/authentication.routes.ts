import { MagicRouter } from '@/utils/core/MagicRouter';
import * as authenticationController from './authentication.controller';
import {
  loginRequestSchema,
  loginResponseSchema,
  assumeRoleRequestSchema,
  assumeRoleResponseSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
} from './authentication.schema';
import { errorResponseSchema } from '@/domains/commons/base/base.schema';
import { requestTenantIdParamsSchema } from '@/domains/commons/base/request.schema';

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
      401: {
        description: 'Unauthorized - Invalid credentials',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Authentication'],
  });

  router.post({
    name: 'assumeRole',
    path: '/assume-role',
    summary: 'Assume role in target realm',
    authentication: { onlyMethods: { jwt: true } },
    handlers: [authenticationController.assumeRole],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: assumeRoleRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role assumed successfully',
        content: {
          'application/json': {
            schema: assumeRoleResponseSchema,
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
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Target realm or role not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Authentication'],
  });

  router.post({
    name: 'refreshToken',
    path: '/refresh',
    summary: 'Refresh access token',
    handlers: [authenticationController.refresh],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: refreshTokenRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Token refreshed successfully',
        content: {
          'application/json': {
            schema: refreshTokenResponseSchema,
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
      401: {
        description: 'Unauthorized - Invalid refresh token',
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
