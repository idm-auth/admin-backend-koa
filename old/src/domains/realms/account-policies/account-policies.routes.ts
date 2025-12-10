import { MagicRouter } from '@/utils/core/MagicRouter';
import { z } from 'zod';
import * as accountPolicyController from './account-policy.controller';
import {
  accountPolicyCreateSchema,
  accountPolicyRemoveSchema,
  accountPolicyBaseResponseSchema,
  accountPolicyListResponseSchema,
} from './account-policy.schema';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndAccountIdParamsSchema,
  requestTenantIdAndPolicyIdParamsSchema,
} from '@/domains/commons/base/request.schema';

const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/account-policies' });

  router.post({
    name: 'createAccountPolicy',
    path: '/',
    summary: 'Create account-policy relationship',
    authentication: { someOneMethod: true },
    handlers: [accountPolicyController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountPolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account-policy relationship created successfully',
        content: {
          'application/json': {
            schema: accountPolicyBaseResponseSchema,
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
    tags: ['Account-Policies'],
  });

  router.delete({
    name: 'removeAccountPolicy',
    path: '/',
    summary: 'Remove account-policy relationship',
    authentication: { someOneMethod: true },
    handlers: [accountPolicyController.remove],
    request: {
      params: requestTenantIdParamsSchema,
      body: {
        content: {
          'application/json': {
            schema: accountPolicyRemoveSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Account-policy relationship removed successfully',
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
        description: 'Account-policy relationship not found',
        content: {
          'application/json': {
            schema: errorResponseSchema,
          },
        },
      },
    },
    tags: ['Account-Policies'],
  });

  router.get({
    name: 'getAccountPolicies',
    path: '/account/:accountId',
    summary: 'Get policies for account',
    authentication: { someOneMethod: true },
    handlers: [accountPolicyController.findByAccountId],
    request: {
      params: requestTenantIdAndAccountIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Account policies found',
        content: {
          'application/json': {
            schema: accountPolicyListResponseSchema,
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
    tags: ['Account-Policies'],
  });

  router.get({
    name: 'getPolicyAccounts',
    path: '/policy/:policyId',
    summary: 'Get accounts with policy',
    authentication: { someOneMethod: true },
    handlers: [accountPolicyController.findByPolicyId],
    request: {
      params: requestTenantIdAndPolicyIdParamsSchema,
    },
    responses: {
      200: {
        description: 'Policy accounts found',
        content: {
          'application/json': {
            schema: accountPolicyListResponseSchema,
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
    tags: ['Account-Policies'],
  });

  return router;
};
