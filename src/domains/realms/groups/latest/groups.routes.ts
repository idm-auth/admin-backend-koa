import { SwaggerRouter } from '@/domains/swagger/swagger-router';
import * as groupController from './group.controller';
import { groupCreateSchema } from './group.schema';
import { DocIdSchema } from '@/schemas/latest/base.schema';
import { z } from 'zod';

// Response schemas
const groupResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// Query schemas
const groupSearchQuerySchema = z.object({
  name: z.string(),
});

// Params schemas
const groupParamsSchema = z.object({
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/groups' });

  // POST /groups - Create group
  router.addRoute({
    name: 'createGroup',
    method: 'post',
    path: '/',
    handlers: [groupController.create],
    validate: {
      body: groupCreateSchema,
      response: groupResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Groups'],
  });

  // GET /groups/search - Search group by name
  router.addRoute({
    name: 'searchGroup',
    method: 'get',
    path: '/search',
    handlers: [groupController.findByName],
    validate: {
      query: groupSearchQuerySchema,
      response: groupResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Groups'],
  });

  // GET /groups/:id - Get group by ID
  router.addRoute({
    name: 'getGroupById',
    method: 'get',
    path: '/:id',
    handlers: [groupController.findById],
    validate: {
      params: groupParamsSchema,
      response: groupResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Groups'],
  });

  // PUT /groups/:id - Update group
  router.addRoute({
    name: 'updateGroup',
    method: 'put',
    path: '/:id',
    handlers: [groupController.update],
    validate: {
      params: groupParamsSchema,
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
      }),
      response: groupResponseSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Groups'],
  });

  // DELETE /groups/:id - Remove group
  router.addRoute({
    name: 'removeGroup',
    method: 'delete',
    path: '/:id',
    handlers: [groupController.remove],
    validate: {
      params: groupParamsSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Groups'],
  });

  return router;
};
