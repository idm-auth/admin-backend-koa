import { MagicRouter } from '@/utils/core/MagicRouter';
import * as roleController from './role.controller';
import {
  roleCreateResponseSchema,
  roleCreateSchema,
  roleListResponseSchema,
  roleReadResponseSchema,
  roleSearchResponseSchema,
  roleUpdateResponseSchema,
  roleUpdateSchema,
} from './role.schema';
import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import { createCrudSwagger } from '@/utils/crudSwagger.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/roles' });
  const swagger = createCrudSwagger(
    'Role',
    roleCreateSchema,
    roleUpdateSchema,
    roleCreateResponseSchema,
    roleUpdateResponseSchema,
    roleReadResponseSchema,
    roleListResponseSchema,
    roleSearchResponseSchema
  );

  // POST /roles - Create role
  router.post({
    name: 'createRole',
    path: '/',
    summary: 'Create role',
    handlers: [roleController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Roles'],
  });

  // GET /roles/:id - Get role by ID
  router.get({
    name: 'getRoleById',
    path: '/:id',
    summary: 'Get role by ID',
    handlers: [roleController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Roles'],
  });

  // PUT /roles/:id - Update role
  router.put({
    name: 'updateRole',
    path: '/:id',
    summary: 'Update role',
    handlers: [roleController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Roles'],
  });

  // DELETE /roles/:id - Remove role
  router.delete({
    name: 'removeRole',
    path: '/:id',
    summary: 'Remove role',
    handlers: [roleController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Roles'],
  });

  return router;
};
