import { MagicRouter } from '@/utils/core/MagicRouter';
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
  const router = new MagicRouter({ prefix: '/groups' });

  // POST /groups - Create group
  router.addRoute({
    name: 'createGroup',
    method: 'post',
    path: '/',
    summary: 'Create group',
    handlers: [groupController.create],
    request: {
      body: {
        content: {
          'application/json': {
            schema: groupCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Group created successfully',
        content: {
          'application/json': {
            schema: groupResponseSchema,
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
    tags: ['Groups'],
  });

  // GET /groups/search - Search group by name
  router.addRoute({
    name: 'searchGroup',
    method: 'get',
    path: '/search',
    summary: 'Search group by name',
    handlers: [groupController.findByName],
    request: {
      query: groupSearchQuerySchema,
    },
    responses: {
      200: {
        description: 'Group found',
        content: {
          'application/json': {
            schema: groupResponseSchema,
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
    tags: ['Groups'],
  });

  // GET /groups/:id - Get group by ID
  router.addRoute({
    name: 'getGroupById',
    method: 'get',
    path: '/{id}',
    summary: 'Get group by ID',
    handlers: [groupController.findById],
    request: {
      params: groupParamsSchema,
    },
    responses: {
      200: {
        description: 'Group found',
        content: {
          'application/json': {
            schema: groupResponseSchema,
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
    tags: ['Groups'],
  });

  // PUT /groups/:id - Update group
  router.addRoute({
    name: 'updateGroup',
    method: 'put',
    path: '/{id}',
    summary: 'Update group',
    handlers: [groupController.update],
    request: {
      params: groupParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: z.object({
              name: z.string().optional(),
              description: z.string().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Group updated successfully',
        content: {
          'application/json': {
            schema: groupResponseSchema,
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
    tags: ['Groups'],
  });

  // DELETE /groups/:id - Remove group
  router.addRoute({
    name: 'removeGroup',
    method: 'delete',
    path: '/{id}',
    summary: 'Remove group',
    handlers: [groupController.remove],
    request: {
      params: groupParamsSchema,
    },
    responses: {
      200: {
        description: 'Group removed successfully',
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
    tags: ['Groups'],
  });

  return router;
};
