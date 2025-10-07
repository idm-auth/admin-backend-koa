import { SwaggerRouter } from '@/utils/swagger-router';
import * as accountGroupController from './account-group.controller';
import { accountGroupCreateSchema } from './account-group.schema';
import { DocIdSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';

// Response schemas
const accountGroupResponseSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  groupId: z.string(),
  roles: z.array(z.string()).optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Params schemas
const accountParamsSchema = z.object({
  accountId: DocIdSchema,
});

const groupParamsSchema = z.object({
  groupId: DocIdSchema,
});

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/account-groups' });

  // POST /account-groups - Add account to group
  router.addRoute({
    name: 'addAccountToGroup',
    method: 'post',
    path: '/',
    handlers: [accountGroupController.addAccountToGroup],
    validate: {
      body: accountGroupCreateSchema,
      response: accountGroupResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Groups'],
  });

  // DELETE /account-groups - Remove account from group
  router.addRoute({
    name: 'removeAccountFromGroup',
    method: 'delete',
    path: '/',
    handlers: [accountGroupController.removeAccountFromGroup],
    validate: {
      body: z.object({
        accountId: z.string(),
        groupId: z.string(),
      }),
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Account-Groups'],
  });

  // PUT /account-groups - Update account group roles
  router.addRoute({
    name: 'updateAccountGroupRoles',
    method: 'put',
    path: '/',
    handlers: [accountGroupController.updateAccountGroupRoles],
    validate: {
      body: z.object({
        accountId: z.string(),
        groupId: z.string(),
        roles: z.array(z.string()),
      }),
      response: accountGroupResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Account-Groups'],
  });

  // GET /account-groups/account/:accountId - Get account groups
  router.addRoute({
    name: 'getAccountGroups',
    method: 'get',
    path: '/account/:accountId',
    handlers: [accountGroupController.getAccountGroups],
    validate: {
      params: accountParamsSchema,
      response: z.array(accountGroupResponseSchema),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Groups'],
  });

  // GET /account-groups/group/:groupId - Get group accounts
  router.addRoute({
    name: 'getGroupAccounts',
    method: 'get',
    path: '/group/:groupId',
    handlers: [accountGroupController.getGroupAccounts],
    validate: {
      params: groupParamsSchema,
      response: z.array(accountGroupResponseSchema),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Groups'],
  });

  return router;
};