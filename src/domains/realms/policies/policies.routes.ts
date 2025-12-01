import { MagicRouter } from '@/utils/core/MagicRouter';
import {
  requestTenantIdParamsSchema,
  requestTenantIdAndIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import * as controller from './policy.controller';
import {
  policyCreateSchema,
  policyCreateResponseSchema,
  policyUpdateSchema,
  policyUpdateResponseSchema,
  policyReadResponseSchema,
  policyPaginatedResponseSchema,
  policyListQuerySchema,
} from './policy.schema';

const router = new MagicRouter({ prefix: '/policies' });

router.post({
  name: 'createPolicy',
  path: '/',
  summary: 'Create policy',
  handlers: [controller.create],
  request: {
    params: requestTenantIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: policyCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Policy created successfully',
      content: {
        'application/json': {
          schema: policyCreateResponseSchema,
        },
      },
    },
  },
  tags: ['Policies'],
});

router.get({
  name: 'getPolicyById',
  path: '/:id',
  summary: 'Get policy by ID',
  handlers: [controller.findById],
  request: {
    params: requestTenantIdAndIdParamsSchema,
  },
  responses: {
    200: {
      description: 'Policy retrieved successfully',
      content: {
        'application/json': {
          schema: policyReadResponseSchema,
        },
      },
    },
  },
  tags: ['Policies'],
});

router.patch({
  name: 'updatePolicy',
  path: '/:id',
  summary: 'Update policy',
  handlers: [controller.update],
  request: {
    params: requestTenantIdAndIdParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: policyUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Policy updated successfully',
      content: {
        'application/json': {
          schema: policyUpdateResponseSchema,
        },
      },
    },
  },
  tags: ['Policies'],
});

router.delete({
  name: 'deletePolicy',
  path: '/:id',
  summary: 'Delete policy',
  handlers: [controller.remove],
  request: {
    params: requestTenantIdAndIdParamsSchema,
  },
  responses: {
    204: {
      description: 'Policy deleted successfully',
    },
  },
  tags: ['Policies'],
});

router.get({
  name: 'listPolicies',
  path: '/',
  summary: 'List policies',
  handlers: [controller.list],
  request: {
    params: requestTenantIdParamsSchema,
    query: policyListQuerySchema,
  },
  responses: {
    200: {
      description: 'Policies retrieved successfully',
      content: {
        'application/json': {
          schema: policyPaginatedResponseSchema,
        },
      },
    },
  },
  tags: ['Policies'],
});

export const initialize = async () => {
  return router;
};

export default router;
