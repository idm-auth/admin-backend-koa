import { SwaggerRouter } from '@/utils/swagger-router';
import * as roleController from './role.controller';
import { roleCreateSchema } from './role.schema';
import { DocIdSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';

// Response schemas
const roleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Query schemas
const roleSearchQuerySchema = z.object({
  name: z.string(),
});

// Params schemas
const roleParamsSchema = z.object({
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/roles' });

  // POST /roles - Create role
  router.addRoute({
    name: 'createRole',
    method: 'post',
    path: '/',
    handlers: [roleController.create],
    validate: {
      body: roleCreateSchema,
      response: roleResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Roles'],
  });

  // GET /roles/search - Search role by name
  router.addRoute({
    name: 'searchRole',
    method: 'get',
    path: '/search',
    handlers: [roleController.findByName],
    validate: {
      query: roleSearchQuerySchema,
      response: roleResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Roles'],
  });

  // GET /roles/:id - Get role by ID
  router.addRoute({
    name: 'getRoleById',
    method: 'get',
    path: '/:id',
    handlers: [roleController.findById],
    validate: {
      params: roleParamsSchema,
      response: roleResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Roles'],
  });

  // PUT /roles/:id - Update role
  router.addRoute({
    name: 'updateRole',
    method: 'put',
    path: '/:id',
    handlers: [roleController.update],
    validate: {
      params: roleParamsSchema,
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        permissions: z.array(z.string()).optional(),
      }),
      response: roleResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Roles'],
  });

  // DELETE /roles/:id - Remove role
  router.addRoute({
    name: 'removeRole',
    method: 'delete',
    path: '/:id',
    handlers: [roleController.remove],
    validate: {
      params: roleParamsSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Roles'],
  });

  return router;
};