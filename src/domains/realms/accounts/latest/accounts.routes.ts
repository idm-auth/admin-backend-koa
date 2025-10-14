import { MagicRouter } from '@/utils/core/MagicRouter';
import * as accountController from './account.controller';
import {
  accountCreateSchema,
  accountResponseSchema,
  accountUpdateSchema,
  accountSearchQuerySchema,
  accountParamsSchema,
} from './account.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

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
    responses: swagger.list.responses,
    tags: ['Accounts'],
  });

  // POST /accounts - Create account
  router.post({
    name: 'createAccount',
    path: '/',
    summary: 'Create account',
    handlers: [accountController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Accounts'],
  });

  // GET /accounts/search - Search account by email
  router.get({
    name: 'searchAccount',
    path: '/search',
    summary: 'Search account by email',
    handlers: [accountController.findByEmail],
    request: {
      query: accountSearchQuerySchema,
    },
    responses: swagger.search.responses,
    tags: ['Accounts'],
  });

  // GET /accounts/:id - Get account by ID
  router.get({
    name: 'getAccountById',
    path: '/:id',
    summary: 'Get account by ID',
    handlers: [accountController.findById],
    request: {
      params: accountParamsSchema,
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
      params: accountParamsSchema,
      ...swagger.update.request,
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
      params: accountParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Accounts'],
  });

  return router;
};
