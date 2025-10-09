import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as groupController from './group.controller';
import { groupCreateSchema } from './group.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

extendZodWithOpenApi(z);

// Response schemas
const groupResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
});

const groupUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
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
  const swagger = createCrudSwagger('Group', groupResponseSchema, groupCreateSchema, groupUpdateSchema);

  // POST /groups - Create group
  router.addRoute({
    name: 'createGroup',
    method: 'post',
    path: '/',
    summary: 'Create group',
    handlers: [groupController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
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
    responses: swagger.search.responses,
    tags: ['Groups'],
  });

  // GET /groups/:id - Get group by ID
  router.addRoute({
    name: 'getGroupById',
    method: 'get',
    path: '/:id',
    summary: 'Get group by ID',
    handlers: [groupController.findById],
    request: {
      params: groupParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Groups'],
  });

  // PUT /groups/:id - Update group
  router.addRoute({
    name: 'updateGroup',
    method: 'put',
    path: '/:id',
    summary: 'Update group',
    handlers: [groupController.update],
    request: {
      params: groupParamsSchema,
      ...swagger.update.request,
    },
    responses: swagger.update.responses,
    tags: ['Groups'],
  });

  // DELETE /groups/:id - Remove group
  router.addRoute({
    name: 'removeGroup',
    method: 'delete',
    path: '/:id',
    summary: 'Remove group',
    handlers: [groupController.remove],
    request: {
      params: groupParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Groups'],
  });

  return router;
};
