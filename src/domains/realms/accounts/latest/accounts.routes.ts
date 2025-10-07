import { SwaggerRouter } from '@/utils/swagger-router';
import * as accountController from './account.controller';
import { accountCreateSchema } from './account.schema';
import { emailSchema, DocIdSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';

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
  const router = new SwaggerRouter({ prefix: '/accounts' });

  // POST /accounts - Create account
  router.addRoute({
    name: 'createAccount',
    method: 'post',
    path: '/',
    handlers: [accountController.create],
    validate: {
      body: accountCreateSchema,
      response: accountResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Accounts'],
  });

  // GET /accounts/search - Search account by email
  router.addRoute({
    name: 'searchAccount',
    method: 'get',
    path: '/search',
    handlers: [accountController.findByEmail],
    validate: {
      query: accountSearchQuerySchema,
      response: accountResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Accounts'],
  });

  // GET /accounts/:id - Get account by ID
  router.addRoute({
    name: 'getAccountById',
    method: 'get',
    path: '/:id',
    handlers: [accountController.findById],
    validate: {
      params: accountParamsSchema,
      response: accountResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Accounts'],
  });

  // PUT /accounts/:id - Update account
  router.addRoute({
    name: 'updateAccount',
    method: 'put',
    path: '/:id',
    handlers: [accountController.update],
    validate: {
      params: accountParamsSchema,
      body: z.object({
        email: emailSchema.optional(),
        password: z.string().optional(),
      }),
      response: accountResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Accounts'],
  });

  // DELETE /accounts/:id - Remove account
  router.addRoute({
    name: 'removeAccount',
    method: 'delete',
    path: '/:id',
    handlers: [accountController.remove],
    validate: {
      params: accountParamsSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Accounts'],
  });

  return router;
};