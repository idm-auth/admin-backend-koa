import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as accountGroupController from './account-group.controller';
import {
  accountGroupCreateSchema,
  accountGroupResponseSchema,
  accountParamsSchema,
  groupParamsSchema,
  removeAccountFromGroupSchema,
  updateAccountGroupRolesSchema,
} from './account-group.schema';
import { errorResponseSchema } from '@/domains/commons/base/latest/base.schema';
import { requestTenantIdParamsSchema } from '@/domains/commons/base/latest/request.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-groups' });



  // POST /account-groups - Add account to group
  router.post({
    name: 'addAccountToGroup',
    path: '/',
    summary: 'Add account to group',
    handlers: [accountGroupController.addAccountToGroup],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountGroupCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account added to group successfully',
        content: {
          'application/json': {
            schema: accountGroupResponseSchema,
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
    tags: ['Account-Groups'],
  });

  // DELETE /account-groups - Remove account from group
  router.delete({
    name: 'removeAccountFromGroup',
    path: '/',
    summary: 'Remove account from group',
    handlers: [accountGroupController.removeAccountFromGroup],
    request: {
      body: {
        content: {
          'application/json': {
            schema: removeAccountFromGroupSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account removed from group successfully',
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
    tags: ['Account-Groups'],
  });

  // PUT /account-groups - Update account group roles
  router.put({
    name: 'updateAccountGroupRoles',
    path: '/',
    summary: 'Update account group roles',
    handlers: [accountGroupController.updateAccountGroupRoles],
    request: {
      body: {
        content: {
          'application/json': {
            schema: updateAccountGroupRolesSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account group roles updated successfully',
        content: {
          'application/json': {
            schema: accountGroupResponseSchema,
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
      404: {
        description: 'Not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Account-Groups'],
  });

  // GET /account-groups/account/:accountId - Get account groups
  router.get({
    name: 'getAccountGroups',
    path: '/account/{accountId}',
    summary: 'Get account groups',
    handlers: [accountGroupController.getAccountGroups],
    request: {
      params: accountParamsSchema,
    },
    responses: {
      200: {
        description: 'List of account groups',
        content: {
          'application/json': {
            schema: z.array(accountGroupResponseSchema),
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
    tags: ['Account-Groups'],
  });

  // GET /account-groups/group/:groupId - Get group accounts
  router.get({
    name: 'getGroupAccounts',
    path: '/group/{groupId}',
    summary: 'Get group accounts',
    handlers: [accountGroupController.getGroupAccounts],
    request: {
      params: groupParamsSchema,
    },
    responses: {
      200: {
        description: 'List of group accounts',
        content: {
          'application/json': {
            schema: z.array(accountGroupResponseSchema),
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
    tags: ['Account-Groups'],
  });

  return router;
};
