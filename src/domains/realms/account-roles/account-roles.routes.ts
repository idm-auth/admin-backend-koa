import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as accountRoleController from './account-role.controller';
import {
  accountRoleCreateSchema,
  accountRoleRemoveSchema,
  accountRoleBaseResponseSchema,
  accountRoleListResponseSchema,
} from './account-role.schema';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndAccountIdParamsSchema,
  requestTenantIdAndRoleIdParamsSchema,
} from '@/domains/commons/base/request.schema';

// Error response schema
const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-roles' });

  // POST /account-roles - Create account-role relationship
  router.post({
    name: 'createAccountRole',
    path: '/',
    summary: 'Create account-role relationship',
    handlers: [accountRoleController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account-role relationship created successfully',
        content: {
          'application/json': {
            schema: accountRoleBaseResponseSchema,
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
    tags: ['Account-Roles'],
  });

  // DELETE /account-roles - Remove account-role relationship
  router.delete({
    name: 'removeAccountRole',
    path: '/',
    summary: 'Remove account-role relationship',
    handlers: [accountRoleController.remove],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountRoleRemoveSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Account-role relationship removed successfully',
      },
      400: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
      404: {
        description: 'Account-role relationship not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Account-Roles'],
  });

  // GET /account-roles/account/:accountId - Get roles for account
  router.get({
    name: 'getAccountRoles',
    path: '/account/:accountId',
    summary: 'Get roles for account',
    handlers: [accountRoleController.findByAccountId],
    request: {
      params: requestTenantIdAndAccountIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Account roles found',
        content: {
          'application/json': {
            schema: accountRoleListResponseSchema,
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
    tags: ['Account-Roles'],
  });

  // GET /account-roles/role/:roleId - Get accounts with role
  router.get({
    name: 'getRoleAccounts',
    path: '/role/:roleId',
    summary: 'Get accounts with role',
    handlers: [accountRoleController.findByRoleId],
    request: {
      params: requestTenantIdAndRoleIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Role accounts found',
        content: {
          'application/json': {
            schema: accountRoleListResponseSchema,
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
    tags: ['Account-Roles'],
  });

  return router;
};
