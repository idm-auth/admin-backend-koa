import { SwaggerRouter } from '@/utils/swagger-router';
import * as policyController from './policy.controller';
import { policyCreateSchema } from './policy.schema';
import { DocIdSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';

// Response schemas
const policyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.record(z.any()).optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Query schemas
const policySearchQuerySchema = z.object({
  name: z.string(),
});

// Params schemas
const policyParamsSchema = z.object({
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/policies' });

  // POST /policies - Create policy
  router.addRoute({
    name: 'createPolicy',
    method: 'post',
    path: '/',
    handlers: [policyController.create],
    validate: {
      body: policyCreateSchema,
      response: policyResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Policies'],
  });

  // GET /policies/search - Search policy by name
  router.addRoute({
    name: 'searchPolicy',
    method: 'get',
    path: '/search',
    handlers: [policyController.findByName],
    validate: {
      query: policySearchQuerySchema,
      response: policyResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Policies'],
  });

  // GET /policies/:id - Get policy by ID
  router.addRoute({
    name: 'getPolicyById',
    method: 'get',
    path: '/:id',
    handlers: [policyController.findById],
    validate: {
      params: policyParamsSchema,
      response: policyResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Policies'],
  });

  // PUT /policies/:id - Update policy
  router.addRoute({
    name: 'updatePolicy',
    method: 'put',
    path: '/:id',
    handlers: [policyController.update],
    validate: {
      params: policyParamsSchema,
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        effect: z.enum(['Allow', 'Deny']).optional(),
        actions: z.array(z.string()).optional(),
        resources: z.array(z.string()).optional(),
        conditions: z.record(z.any()).optional(),
      }),
      response: policyResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Policies'],
  });

  // DELETE /policies/:id - Remove policy
  router.addRoute({
    name: 'removePolicy',
    method: 'delete',
    path: '/:id',
    handlers: [policyController.remove],
    validate: {
      params: policyParamsSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Policies'],
  });

  return router;
};