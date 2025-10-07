import { SwaggerRouter } from '@/domains/swagger/swagger-router';
import * as groupRoleController from './group-role.controller';
import {
  groupRoleCreateSchema,
  groupRoleResponseSchema,
  groupRoleParamsSchema,
  roleGroupParamsSchema,
  errorResponseSchema,
} from './group-role.schema';

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/group-roles' });

  router.addRoute({
    name: 'addRoleToGroup',
    method: 'post',
    path: '/',
    handlers: [groupRoleController.addRoleToGroup],
    validate: {
      body: groupRoleCreateSchema,
      response: groupRoleResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'removeRoleFromGroup',
    method: 'delete',
    path: '/',
    handlers: [groupRoleController.removeRoleFromGroup],
    validate: {
      body: groupRoleCreateSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'getGroupRoles',
    method: 'get',
    path: '/group/:groupId',
    handlers: [groupRoleController.getGroupRoles],
    validate: {
      params: groupRoleParamsSchema,
      response: groupRoleResponseSchema.array(),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'getRoleGroups',
    method: 'get',
    path: '/role/:roleId',
    handlers: [groupRoleController.getRoleGroups],
    validate: {
      params: roleGroupParamsSchema,
      response: groupRoleResponseSchema.array(),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Group-Roles'],
  });

  return router;
};
