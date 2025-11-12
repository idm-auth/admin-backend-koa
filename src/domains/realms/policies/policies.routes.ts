import { MagicRouter } from '@/utils/core/MagicRouter';
import * as policyController from './policy.controller';
import {
  policyCreateResponseSchema,
  policyCreateSchema,
  policyListResponseSchema,
  policyReadResponseSchema,
  policySearchResponseSchema,
  policyUpdateResponseSchema,
  policyUpdateSchema,
} from './policy.schema';
import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import { createCrudSwagger } from '@/utils/crudSwagger.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/policies' });
  const swagger = createCrudSwagger(
    'Policy',
    policyCreateSchema,
    policyUpdateSchema,
    policyCreateResponseSchema,
    policyUpdateResponseSchema,
    policyReadResponseSchema,
    policyListResponseSchema,
    policySearchResponseSchema
  );

  // POST /policies - Create policy
  router.post({
    name: 'createPolicy',
    path: '/',
    summary: 'Create policy',
    handlers: [policyController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
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
      body: swagger.update.request.body,
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