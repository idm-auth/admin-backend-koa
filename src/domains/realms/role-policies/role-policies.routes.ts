import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as rolePolicyController from './role-policy.controller';
import {
  rolePolicyCreateSchema,
  rolePolicyRemoveSchema,
  rolePolicyBaseResponseSchema,
  rolePolicyListResponseSchema,
} from './role-policy.schema';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndRoleIdParamsSchema,
  requestTenantIdAndPolicyIdParamsSchema,
} from '@/domains/commons/base/request.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/role-policies' });

  router.post({
    name: 'createRolePolicy',
    path: '/',
    summary: 'Create role-policy relationship',
    handlers: [rolePolicyController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: rolePolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Role-policy relationship created successfully',
        content: {
          'application/json': {
            schema: rolePolicyBaseResponseSchema,
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
    tags: ['Role-Policies'],
  });

  router.delete({
    name: 'removeRolePolicy',
    path: '/',
    summary: 'Remove role-policy relationship',
    handlers: [rolePolicyController.remove],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: rolePolicyRemoveSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Role-policy relationship removed successfully',
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
        description: 'Role-policy relationship not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Role-Policies'],
  });

  router.get({
    name: 'getRolePolicies',
    path: '/role/:roleId',
    summary: 'Get policies for role',
    handlers: [rolePolicyController.findByRoleId],
    request: {
      params: requestTenantIdAndRoleIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Role policies found',
        content: {
          'application/json': {
            schema: rolePolicyListResponseSchema,
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
    tags: ['Role-Policies'],
  });

  router.get({
    name: 'getPolicyRoles',
    path: '/policy/:policyId',
    summary: 'Get roles with policy',
    handlers: [rolePolicyController.findByPolicyId],
    request: {
      params: requestTenantIdAndPolicyIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Policy roles found',
        content: {
          'application/json': {
            schema: rolePolicyListResponseSchema,
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
    tags: ['Role-Policies'],
  });

  return router;
};
