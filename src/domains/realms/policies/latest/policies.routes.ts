import { MagicRouter } from '@/utils/core/MagicRouter';
import * as policyController from './policy.controller';
import {
  policyCreateSchema,
  policyResponseSchema,
  policyUpdateSchema,
} from './policy.schema';
import { requestTenantIdAndIdParamsSchema } from '@/domains/commons/base/latest/request.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/policies' });
  const swagger = createCrudSwagger(
    'Policy',
    policyResponseSchema,
    policyCreateSchema,
    policyUpdateSchema
  );

  // GET /policies - List all policies
  router.get({
    name: 'listPolicies',
    path: '/',
    summary: 'List all policies',
    handlers: [policyController.findAll],
    responses: swagger.list.responses,
    tags: ['Policies'],
  });

  // POST /policies - Create policy
  router.post({
    name: 'createPolicy',
    path: '/',
    summary: 'Create policy',
    handlers: [policyController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Policies'],
  });

  // GET /policies/:id - Get policy by ID
  router.get({
    name: 'getPolicyById',
    path: '/:id',
    summary: 'Get policy by ID',
    handlers: [policyController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Policies'],
  });

  // PUT /policies/:id - Update policy
  router.put({
    name: 'updatePolicy',
    path: '/:id',
    summary: 'Update policy',
    handlers: [policyController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      ...swagger.update.request,
    },
    responses: swagger.update.responses,
    tags: ['Policies'],
  });

  // DELETE /policies/:id - Remove policy
  router.delete({
    name: 'removePolicy',
    path: '/:id',
    summary: 'Remove policy',
    handlers: [policyController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Policies'],
  });

  return router;
};
