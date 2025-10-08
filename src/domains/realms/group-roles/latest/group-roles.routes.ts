import { MagicRouter } from '@/utils/core/MagicRouter';
import * as groupRoleController from './group-role.controller';
import {
  groupRoleCreateSchema,
  groupRoleResponseSchema,
  groupRoleParamsSchema,
  roleGroupParamsSchema,
  errorResponseSchema,
} from './group-role.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/group-roles' });

  router.addRoute({
    name: 'addRoleToGroup',
    method: 'post',
    path: '/',
    summary: 'Add role to group',
    handlers: [groupRoleController.addRoleToGroup],
    request: {
      body: {
        content: {
          'application/json': {
            schema: groupRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role added to group successfully',
        content: {
          'application/json': {
            schema: groupRoleResponseSchema,
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
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'removeRoleFromGroup',
    method: 'delete',
    path: '/',
    summary: 'Remove role from group',
    handlers: [groupRoleController.removeRoleFromGroup],
    request: {
      body: {
        content: {
          'application/json': {
            schema: groupRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role removed from group successfully',
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
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'getGroupRoles',
    method: 'get',
    path: '/group/{groupId}',
    summary: 'Get group roles',
    handlers: [groupRoleController.getGroupRoles],
    request: {
      params: groupRoleParamsSchema,
    },
    responses: {
      200: {
        description: 'List of group roles',
        content: {
          'application/json': {
            schema: groupRoleResponseSchema.array(),
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
    tags: ['Group-Roles'],
  });

  router.addRoute({
    name: 'getRoleGroups',
    method: 'get',
    path: '/role/{roleId}',
    summary: 'Get role groups',
    handlers: [groupRoleController.getRoleGroups],
    request: {
      params: roleGroupParamsSchema,
    },
    responses: {
      200: {
        description: 'List of role groups',
        content: {
          'application/json': {
            schema: groupRoleResponseSchema.array(),
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
    tags: ['Group-Roles'],
  });

  return router;
};
