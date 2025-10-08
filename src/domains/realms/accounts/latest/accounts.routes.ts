import { MagicRouter } from '@/domains/swagger/MagicRouter';
import { DocIdSchema, emailSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';
import * as accountController from './account.controller';
import { accountCreateSchema } from './account.schema';

// Response schemas
const accountResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Query schemas
const accountSearchQuerySchema = z.object({
  email: emailSchema,
});

// Params schemas
const accountParamsSchema = z.object({
  tenantId: DocIdSchema,
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/accounts' });

  // POST /accounts - Create account
  router.addRoute({
    name: 'createAccount',
    method: 'post',
    path: '/',
    summary: 'Create account',
    handlers: [accountController.create],
    request: {
      body: {
        content: {
          'application/json': {
            schema: accountCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: accountResponseSchema,
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
    responses: {
      200: {
        description: 'Account found',
        content: {
          'application/json': {
            schema: accountResponseSchema,
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
    tags: ['Accounts'],
  });

  // GET /accounts/:id - Get account by ID
  router.addRoute({
    name: 'getAccountById',
    method: 'get',
    path: '/{id}',
    summary: 'Get account by ID',
    handlers: [accountController.findById],
    request: {
      params: accountParamsSchema,
    },
    responses: {
      200: {
        description: 'Account found',
        content: {
          'application/json': {
            schema: accountResponseSchema,
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
    tags: ['Accounts'],
  });

  // PUT /accounts/:id - Update account
  router.addRoute({
    name: 'updateAccount',
    method: 'put',
    path: '/{id}',
    summary: 'Update account',
    handlers: [accountController.update],
    request: {
      params: accountParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: z.object({
              email: emailSchema.optional(),
              password: z.string().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account updated successfully',
        content: {
          'application/json': {
            schema: accountResponseSchema,
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
    tags: ['Accounts'],
  });

  // DELETE /accounts/:id - Remove account
  router.addRoute({
    name: 'removeAccount',
    method: 'delete',
    path: '/{id}',
    summary: 'Remove account',
    handlers: [accountController.remove],
    request: {
      params: accountParamsSchema,
    },
    responses: {
      200: {
        description: 'Account removed successfully',
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
    tags: ['Accounts'],
  });

  return router;
};
