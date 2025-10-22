import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountController from './account.controller';
import {
  accountCreateSchema,
  accountResponseSchema,
  accountUpdateSchema,
} from './account.schema';
import { requestTenantIdAndIdParamsSchema } from '@/domains/commons/base/latest/request.schema';
import { publicUUIDSchema } from '@/domains/commons/base/latest/base.schema';
import { z } from 'zod';

const requestTenantIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
});
import { createCrudSwagger } from '@/utils/crudSwagger.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  const swagger = createCrudSwagger(
    'Account',
    accountResponseSchema,
    accountCreateSchema,
    accountUpdateSchema
  );

  // GET /accounts - List all accounts
  router.get({
    name: 'listAccounts',
    path: '/',
    summary: 'List all accounts',
    handlers: [accountController.findAll],
    request: {
      params: requestTenantIdParamsSchema,
    },
    responses: swagger.list.responses,
    tags: ['Accounts'],
  });

  // POST /accounts - Create account
  router.post({
    name: 'createAccount',
    path: '/',
    summary: 'Create account',
    handlers: [accountController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Accounts'],
  });

  // GET /accounts/:id - Get account by ID
  router.get({
    name: 'getAccountById',
    path: '/:id',
    summary: 'Get account by ID',
    handlers: [accountController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Accounts'],
  });

  // PUT /accounts/:id - Update account
  router.put({
    name: 'updateAccount',
    path: '/:id',
    summary: 'Update account',
    handlers: [accountController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Accounts'],
  });

  // DELETE /accounts/:id - Remove account
  router.delete({
    name: 'removeAccount',
    path: '/:id',
    summary: 'Remove account',
    handlers: [accountController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Accounts'],
  });

  return router;
};
