import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as accountGroupController from './account-group.controller';
import { accountGroupCreateSchema } from './account-group.schema';
import { DocIdSchema, errorResponseSchema } from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

// Response schemas
const accountGroupResponseSchema = z.object({
  id: DocIdSchema,
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(DocIdSchema).optional(),
});

// Params schemas
const accountParamsSchema = z.object({
  accountId: DocIdSchema,
});

const groupParamsSchema = z.object({
  groupId: DocIdSchema,
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-groups' });

  // POST /account-groups - Add account to group
  router.addRoute({
    name: 'addAccountToGroup',
    method: 'post',
    path: '/',
    summary: 'Add account to group',
    handlers: [accountGroupController.addAccountToGroup],
    request: {
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
  router.addRoute({
    name: 'removeAccountFromGroup',
    method: 'delete',
    path: '/',
    summary: 'Remove account from group',
    handlers: [accountGroupController.removeAccountFromGroup],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              accountId: z.string(),
              groupId: z.string(),
            }),
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
  router.addRoute({
    name: 'updateAccountGroupRoles',
    method: 'put',
    path: '/',
    summary: 'Update account group roles',
    handlers: [accountGroupController.updateAccountGroupRoles],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              accountId: z.string(),
              groupId: z.string(),
              roles: z.array(z.string()),
            }),
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
  router.addRoute({
    name: 'getAccountGroups',
    method: 'get',
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
  router.addRoute({
    name: 'getGroupAccounts',
    method: 'get',
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
