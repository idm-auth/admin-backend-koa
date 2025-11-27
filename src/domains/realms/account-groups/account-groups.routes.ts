import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as accountGroupController from './account-group.controller';
import {
  accountGroupCreateSchema,
  accountGroupBaseResponseSchema,
  removeAccountFromGroupSchema,
} from './account-group.schema';
import { errorResponseSchema } from '@/domains/commons/base/base.schema';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndAccountIdParamsSchema,
  requestTenantIdAndGroupIdParamsSchema,
} from '@/domains/commons/base/request.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-groups' });

  // POST /account-groups - Add account to group
  router.post({
    name: 'createAccountGroup',
    path: '/',
    summary: 'Add account to group',
    handlers: [accountGroupController.create],
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
      201: {
        description: 'Account added to group successfully',
        content: {
          'application/json': {
            schema: accountGroupBaseResponseSchema,
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
    handlers: [accountGroupController.remove],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: removeAccountFromGroupSchema,
          },
        },
      },
    },
    responses: {
      204: {
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
        description: 'Account-Group relationship not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Account-Groups'],
  });

  // GET /account-groups/account/{accountId} - Get account groups
  router.get({
    name: 'getAccountGroups',
    path: '/account/{accountId}',
    summary: 'Get account groups',
    handlers: [accountGroupController.findByAccountId],
    request: {
      params: requestTenantIdAndAccountIdParamsSchema,
    },
    responses: {
      200: {
        description: 'List of account groups',
        content: {
          'application/json': {
            schema: z.array(accountGroupBaseResponseSchema),
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

  // GET /account-groups/group/{groupId} - Get group accounts
  router.get({
    name: 'getGroupAccounts',
    path: '/group/{groupId}',
    summary: 'Get group accounts',
    handlers: [accountGroupController.findByGroupId],
    request: {
      params: requestTenantIdAndGroupIdParamsSchema,
    },
    responses: {
      200: {
        description: 'List of group accounts',
        content: {
          'application/json': {
            schema: z.array(accountGroupBaseResponseSchema),
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
