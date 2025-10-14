import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as accountController from './account.controller';
import { accountCreateSchema } from './account.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

extendZodWithOpenApi(z);

// Response schemas
const accountResponseSchema = z.object({
  id: DocIdSchema,
  email: z.string().email(),
});

const accountUpdateSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});

// Query schemas
const accountSearchQuerySchema = z.object({
  email: z.string(),
});

// Params schemas
const accountParamsSchema = z.object({
  tenantId: z.string(),
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  const swagger = createCrudSwagger(
    'Account',
    accountResponseSchema,
    accountCreateSchema,
    accountUpdateSchema
  );

  // GET /accounts - List all accounts
  router.addRoute({
    name: 'listAccounts',
    method: 'get',
    path: '/',
    summary: 'List all accounts',
    handlers: [accountController.findAll],
    responses: swagger.list.responses,
    tags: ['Accounts'],
  });

  // POST /accounts - Create account
  router.addRoute({
    name: 'createAccount',
    method: 'post',
    path: '/',
    summary: 'Create account',
    handlers: [accountController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Accounts'],
  });

  // GET /accounts/search - Search account by email
  router.addRoute({
    name: 'searchAccount',
    method: 'get',
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
  router.addRoute({
    name: 'getAccountById',
    method: 'get',
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
  router.addRoute({
    name: 'updateAccount',
    method: 'put',
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
  router.addRoute({
    name: 'removeAccount',
    method: 'delete',
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
