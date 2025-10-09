import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as roleController from './role.controller';
import { roleCreateSchema } from './role.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

extendZodWithOpenApi(z);

// Response schemas
const roleResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const roleUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
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
  const router = new MagicRouter({ prefix: '/roles' });
  const swagger = createCrudSwagger('Role', roleResponseSchema, roleCreateSchema, roleUpdateSchema);

  // POST /roles - Create role
  router.addRoute({
    name: 'createRole',
    method: 'post',
    path: '/',
    summary: 'Create role',
    handlers: [roleController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Roles'],
  });

  // GET /roles/search - Search role by name
  router.addRoute({
    name: 'searchRole',
    method: 'get',
    path: '/search',
    summary: 'Search role by name',
    handlers: [roleController.findByName],
    request: {
      query: roleSearchQuerySchema,
    },
    responses: swagger.search.responses,
    tags: ['Roles'],
  });

  // GET /roles/:id - Get role by ID
  router.addRoute({
    name: 'getRoleById',
    method: 'get',
    path: '/:id',
    summary: 'Get role by ID',
    handlers: [roleController.findById],
    request: {
      params: roleParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Roles'],
  });

  // PUT /roles/:id - Update role
  router.addRoute({
    name: 'updateRole',
    method: 'put',
    path: '/:id',
    summary: 'Update role',
    handlers: [roleController.update],
    request: {
      params: roleParamsSchema,
      ...swagger.update.request,
    },
    responses: swagger.update.responses,
    tags: ['Roles'],
  });

  // DELETE /roles/:id - Remove role
  router.addRoute({
    name: 'removeRole',
    method: 'delete',
    path: '/:id',
    summary: 'Remove role',
    handlers: [roleController.remove],
    request: {
      params: roleParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Roles'],
  });

  return router;
};
