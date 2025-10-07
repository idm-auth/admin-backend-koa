import { SwaggerRouter } from '@/utils/swagger-router';
import * as accountRoleController from './account-role.controller';
import {
  accountRoleCreateSchema,
  accountRoleResponseSchema,
  accountRoleParamsSchema,
  roleAccountParamsSchema,
  errorResponseSchema,
} from './account-role.schema';

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/account-roles' });

  router.addRoute({
    name: 'addRoleToAccount',
    method: 'post',
    path: '/',
    handlers: [accountRoleController.addRoleToAccount],
    validate: {
      body: accountRoleCreateSchema,
      response: accountRoleResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Roles'],
  });

  router.addRoute({
    name: 'removeRoleFromAccount',
    method: 'delete',
    path: '/',
    handlers: [accountRoleController.removeRoleFromAccount],
    validate: {
      body: accountRoleCreateSchema,
      responses: {
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    tags: ['Account-Roles'],
  });

  router.addRoute({
    name: 'getAccountRoles',
    method: 'get',
    path: '/account/:accountId',
    handlers: [accountRoleController.getAccountRoles],
    validate: {
      params: accountRoleParamsSchema,
      response: accountRoleResponseSchema.array(),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Roles'],
  });

  router.addRoute({
    name: 'getRoleAccounts',
    method: 'get',
    path: '/roles/:roleId',
    handlers: [accountRoleController.getRoleAccounts],
    validate: {
      params: roleAccountParamsSchema,
      response: accountRoleResponseSchema.array(),
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Account-Roles'],
  });

  return router;
};