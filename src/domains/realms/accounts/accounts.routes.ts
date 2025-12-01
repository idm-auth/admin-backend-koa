import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';
import * as accountController from './account.controller';
import {
  accountAddEmailSchema,
  accountCreateResponseSchema,
  accountCreateSchema,
  accountPaginatedResponseSchema,
  accountReadResponseSchema,
  accountRemoveEmailSchema,
  accountResetPasswordSchema,
  accountSetActiveStatusSchema,
  accountSetPrimaryEmailSchema,
  accountUpdatePasswordSchema,
  accountUpdateResponseSchema,
  accountUpdateSchema,
} from './account.schema';

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

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });
  const swagger = createCrudSwagger(
    'Account',
    accountCreateSchema,
    accountUpdateSchema,
    accountCreateResponseSchema,
    accountUpdateResponseSchema,
    accountReadResponseSchema,
    accountPaginatedResponseSchema
  );

  // GET /accounts - List all accounts (paginated)
  router.get({
    name: 'listAccounts',
    path: '/',
    summary: 'List all accounts with pagination',
    handlers: [accountController.findAllPaginated],
    authentication: {
      jwt: true,
    },
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
        content: { 'application/json': { schema: accountUpdateSchema } },
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

  // PATCH /accounts/:id/update-password - Update account password
  router.patch({
    name: 'updateAccountPassword',
    path: '/:id/update-password',
    summary: 'Update account password',
    handlers: [accountController.updatePassword],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountUpdatePasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password updated successfully',
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
        description: 'Account not found or current password incorrect',
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

  // POST /accounts/:id/email - Add email to account
  router.post({
    name: 'addAccountEmail',
    path: '/:id/email',
    summary: 'Add email to account',
    handlers: [accountController.addEmail],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountAddEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Email added successfully',
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

  // POST /accounts/:id/email/remove - Remove email from account
  router.post({
    name: 'removeAccountEmail',
    path: '/:id/email/remove',
    summary: 'Remove email from account',
    handlers: [accountController.removeEmail],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountRemoveEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Email removed successfully',
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
        description: 'Account not found or email not found',
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

  // PATCH /accounts/:id/email/primary - Set primary email
  router.patch({
    name: 'setAccountPrimaryEmail',
    path: '/:id/email/primary',
    summary: 'Set primary email for account',
    handlers: [accountController.setPrimaryEmail],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountSetPrimaryEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Primary email set successfully',
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
        description: 'Account not found or email not found',
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

  // PATCH /accounts/:id/active-status - Set account active status
  router.patch({
    name: 'setAccountActiveStatus',
    path: '/:id/active-status',
    summary: 'Set account active status',
    handlers: [accountController.setActiveStatus],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountSetActiveStatusSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account active status set successfully',
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
