import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as groupPolicyController from './group-policy.controller';
import {
  groupPolicyCreateSchema,
  groupPolicyRemoveSchema,
  groupPolicyBaseResponseSchema,
  groupPolicyListResponseSchema,
} from './group-policy.schema';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndGroupIdParamsSchema,
  requestTenantIdAndPolicyIdParamsSchema,
} from '@/domains/commons/base/request.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/group-policies' });

  router.post({
    name: 'createGroupPolicy',
    path: '/',
    summary: 'Create group-policy relationship',
    authentication: { someOneMethod: true },
    handlers: [groupPolicyController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: groupPolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Group-policy relationship created successfully',
        content: {
          'application/json': {
            schema: groupPolicyBaseResponseSchema,
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
    tags: ['Group-Policies'],
  });

  router.delete({
    name: 'removeGroupPolicy',
    path: '/',
    summary: 'Remove group-policy relationship',
    authentication: { someOneMethod: true },
    handlers: [groupPolicyController.remove],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: groupPolicyRemoveSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Group-policy relationship removed successfully',
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
        description: 'Group-policy relationship not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Group-Policies'],
  });

  router.get({
    name: 'getGroupPolicies',
    path: '/group/:groupId',
    summary: 'Get policies for group',
    authentication: { someOneMethod: true },
    handlers: [groupPolicyController.findByGroupId],
    request: {
      params: requestTenantIdAndGroupIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Group policies found',
        content: {
          'application/json': {
            schema: groupPolicyListResponseSchema,
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
    tags: ['Group-Policies'],
  });

  router.get({
    name: 'getPolicyGroups',
    path: '/policy/:policyId',
    summary: 'Get groups with policy',
    authentication: { someOneMethod: true },
    handlers: [groupPolicyController.findByPolicyId],
    request: {
      params: requestTenantIdAndPolicyIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Policy groups found',
        content: {
          'application/json': {
            schema: groupPolicyListResponseSchema,
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
    tags: ['Group-Policies'],
  });

  return router;
};
