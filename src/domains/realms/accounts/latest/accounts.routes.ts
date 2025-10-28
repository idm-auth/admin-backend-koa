import { publicUUIDSchema } from '@/domains/commons/base/latest/base.schema';
import { requestTenantIdAndIdParamsSchema } from '@/domains/commons/base/latest/request.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';
import * as accountController from './account.controller';
import {
  accountCreateResponseSchema,
  accountCreateSchema,
  accountListResponseSchema,
  accountPaginatedResponseSchema,
  accountReadResponseSchema,
  accountResetPasswordSchema,
  accountSearchResponseSchema,
  accountUpdateResponseSchema,
  accountUpdateSchema,
} from './account.schema';
import {
  emailSchema,
  passwordSchema,
} from '@/domains/commons/base/v1/base.schema';

const requestTenantIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
});

// Safe query schema that prevents SSRF by restricting filter values
const safeAccountListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  filter: z
    .string()
    .regex(/^[a-zA-Z0-9\s@._-]*$/, 'Invalid filter format')
    .max(100)
    .optional(),
  sortBy: z.enum(['email', 'createdAt', 'updatedAt']).optional(),
  descending: z.coerce.boolean().default(false),
});

// Safe update schema that prevents SSRF by using proper validation
const safeAccountUpdateSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  const swagger = createCrudSwagger(
    'Account',
    accountCreateSchema,
    accountUpdateSchema,
    accountCreateResponseSchema,
    accountUpdateResponseSchema,
    accountReadResponseSchema,
    accountListResponseSchema,
    accountSearchResponseSchema,
    accountPaginatedResponseSchema
  );

  // GET /accounts - List all accounts (paginated)
  router.get({
    name: 'listAccounts',
    path: '/',
    summary: 'List all accounts with pagination',
    handlers: [accountController.findAllPaginated],
    request: {
      params: requestTenantIdParamsSchema,
      query: safeAccountListQuerySchema,
    },
    responses: swagger.listPaginated.responses,
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
      body: {
        content: { 'application/json': { schema: safeAccountUpdateSchema } },
      },
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

  // PATCH /accounts/:id/reset-password - Reset account password
  router.patch({
    name: 'resetAccountPassword',
    path: '/:id/reset-password',
    summary: 'Reset account password',
    handlers: [accountController.resetPassword],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountResetPasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successfully',
        content: {
          'application/json': {
            schema: accountUpdateResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
              details: z.string().optional(),
            }),
          },
        },
      },
      404: {
        description: 'Account not found',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
              details: z.string().optional(),
            }),
          },
        },
      },
    },
    tags: ['Accounts'],
  });

  return router;
};
