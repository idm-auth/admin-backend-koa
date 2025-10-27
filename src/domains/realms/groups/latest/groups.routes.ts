import { MagicRouter } from '@/utils/core/MagicRouter';
import * as groupController from './group.controller';
import {
  groupCreateResponseSchema,
  groupCreateSchema,
  groupListResponseSchema,
  groupReadResponseSchema,
  groupSearchResponseSchema,
  groupUpdateResponseSchema,
  groupUpdateSchema,
} from './group.schema';
import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/latest/request.schema';
import { createCrudSwagger } from '@/utils/crudSwagger.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/groups' });
  const swagger = createCrudSwagger(
    'Group',
    groupCreateSchema,
    groupUpdateSchema,
    groupCreateResponseSchema,
    groupUpdateResponseSchema,
    groupReadResponseSchema,
    groupListResponseSchema,
    groupSearchResponseSchema
  );

  // GET /groups - List all groups
  router.get({
    name: 'listGroups',
    path: '/',
    summary: 'List all groups',
    handlers: [groupController.findAll],
    request: {
      params: requestTenantIdParamsSchema,
    },
    responses: swagger.list.responses,
    tags: ['Groups'],
  });

  // POST /groups - Create group
  router.post({
    name: 'createGroup',
    path: '/',
    summary: 'Create group',
    handlers: [groupController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Groups'],
  });

  // GET /groups/:id - Get group by ID
  router.get({
    name: 'getGroupById',
    path: '/:id',
    summary: 'Get group by ID',
    handlers: [groupController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Groups'],
  });

  // PUT /groups/:id - Update group
  router.put({
    name: 'updateGroup',
    path: '/:id',
    summary: 'Update group',
    handlers: [groupController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Groups'],
  });

  // DELETE /groups/:id - Remove group
  router.delete({
    name: 'removeGroup',
    path: '/:id',
    summary: 'Remove group',
    handlers: [groupController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Groups'],
  });

  return router;
};
