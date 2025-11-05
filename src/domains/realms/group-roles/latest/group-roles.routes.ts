import { MagicRouter } from '@/utils/core/MagicRouter';
import * as groupRoleController from './group-role.controller';
import {
  groupRoleCreateSchema,
  groupRoleResponseSchema,
  groupRoleParamsSchema,
  roleGroupParamsSchema,
} from './group-role.schema';
import { errorResponseSchema } from '@/domains/commons/base/latest/base.schema';
import { requestTenantIdParamsSchema } from '@/domains/commons/base/latest/request.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/group-roles' });



  router.post({
    name: 'addRoleToGroup',
    path: '/',
    summary: 'Add role to group',
    handlers: [groupRoleController.addRoleToGroup],
    request: {
      params: requestTenantIdParamsSchema,
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

  router.delete({
    name: 'removeRoleFromGroup',
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

  router.get({
    name: 'getGroupRoles',
    path: '/group/:groupId',
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

  router.get({
    name: 'getRoleGroups',
    path: '/role/:roleId',
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
