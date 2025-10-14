import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountRoleController from './account-role.controller';
import {
  accountRoleCreateSchema,
  accountRoleResponseSchema,
  accountRoleParamsSchema,
  roleAccountParamsSchema,
} from './account-role.schema';
import { errorResponseSchema } from '@/domains/commons/base/latest/base.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-roles' });

  // GET /account-roles - List all account-roles
  router.addRoute({
    name: 'listAccountRoles',
    method: 'get',
    path: '/',
    summary: 'List all account-roles',
    handlers: [accountRoleController.findAll],
    responses: {
      200: {
        description: 'List of account-roles',
        content: {
          'application/json': {
            schema: accountRoleResponseSchema.array(),
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

  router.addRoute({
    name: 'addRoleToAccount',
    method: 'post',
    path: '/',
    summary: 'Add role to account',
    handlers: [accountRoleController.addRoleToAccount],
    request: {
      body: {
        content: {
          'application/json': {
            schema: accountRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role added to account successfully',
        content: {
          'application/json': {
            schema: accountRoleResponseSchema,
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

  router.addRoute({
    name: 'removeRoleFromAccount',
    method: 'delete',
    path: '/',
    summary: 'Remove role from account',
    handlers: [accountRoleController.removeRoleFromAccount],
    request: {
      body: {
        content: {
          'application/json': {
            schema: accountRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role removed from account successfully',
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
        description: 'Not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Account-Roles'],
  });

  router.addRoute({
    name: 'getAccountRoles',
    method: 'get',
    path: '/account/:accountId',
    summary: 'Get account roles',
    handlers: [accountRoleController.getAccountRoles],
    request: {
      params: accountRoleParamsSchema,
    },
    responses: {
      200: {
        description: 'List of account roles',
        content: {
          'application/json': {
            schema: accountRoleResponseSchema.array(),
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

  router.addRoute({
    name: 'getRoleAccounts',
    method: 'get',
    path: '/roles/:roleId',
    summary: 'Get role accounts',
    handlers: [accountRoleController.getRoleAccounts],
    request: {
      params: roleAccountParamsSchema,
    },
    responses: {
      200: {
        description: 'List of role accounts',
        content: {
          'application/json': {
            schema: accountRoleResponseSchema.array(),
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
