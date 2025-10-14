import { MagicRouter } from '@/utils/core/MagicRouter';
import * as roleController from './role.controller';
import {
  roleCreateSchema,
  roleResponseSchema,
  roleUpdateSchema,
  roleSearchQuerySchema,
  roleParamsSchema,
} from './role.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/roles' });
  const swagger = createCrudSwagger(
    'Role',
    roleResponseSchema,
    roleCreateSchema,
    roleUpdateSchema
  );

  // GET /roles - List all roles
  router.addRoute({
    name: 'listRoles',
    method: 'get',
    path: '/',
    summary: 'List all roles',
    handlers: [roleController.findAll],
    responses: swagger.list.responses,
    tags: ['Roles'],
  });

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
