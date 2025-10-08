import { DocIdSchema } from '@/schemas/latest/base.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as policyController from './policy.controller';
import { policyCreateSchema } from './policy.schema';

// Response schemas
const policyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.record(z.string(), z.any()).optional(),
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
  const router = new MagicRouter({ prefix: '/policies' });

  // POST /policies - Create policy
  router.addRoute({
    name: 'createPolicy',
    method: 'post',
    path: '/',
    summary: 'Create policy',
    handlers: [policyController.create],
    request: {
      body: {
        content: {
          'application/json': {
            schema: policyCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy created successfully',
        content: {
          'application/json': {
            schema: policyResponseSchema,
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
    tags: ['Policies'],
  });

  // GET /policies/search - Search policy by name
  router.addRoute({
    name: 'searchPolicy',
    method: 'get',
    path: '/search',
    summary: 'Search policy by name',
    handlers: [policyController.findByName],
    request: {
      query: policySearchQuerySchema,
    },
    responses: {
      200: {
        description: 'Policy found',
        content: {
          'application/json': {
            schema: policyResponseSchema,
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
    tags: ['Policies'],
  });

  // GET /policies/:id - Get policy by ID
  router.addRoute({
    name: 'getPolicyById',
    method: 'get',
    path: '/{id}',
    summary: 'Get policy by ID',
    handlers: [policyController.findById],
    request: {
      params: policyParamsSchema,
    },
    responses: {
      200: {
        description: 'Policy found',
        content: {
          'application/json': {
            schema: policyResponseSchema,
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
    tags: ['Policies'],
  });

  // PUT /policies/:id - Update policy
  router.addRoute({
    name: 'updatePolicy',
    method: 'put',
    path: '/{id}',
    summary: 'Update policy',
    handlers: [policyController.update],
    request: {
      params: policyParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional(),
              description: z.string().optional(),
              effect: z.enum(['Allow', 'Deny']).optional(),
              actions: z.array(z.string()).optional(),
              resources: z.array(z.string()).optional(),
              conditions: z.record(z.string(), z.string()).optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy updated successfully',
        content: {
          'application/json': {
            schema: policyResponseSchema,
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
    tags: ['Policies'],
  });

  // DELETE /policies/:id - Remove policy
  router.addRoute({
    name: 'removePolicy',
    method: 'delete',
    path: '/{id}',
    summary: 'Remove policy',
    handlers: [policyController.remove],
    request: {
      params: policyParamsSchema,
    },
    responses: {
      200: {
        description: 'Policy removed successfully',
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
    tags: ['Policies'],
  });

  return router;
};
