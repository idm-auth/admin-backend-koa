import { MagicRouter } from '@/utils/core/MagicRouter';
import * as policyController from './policy.controller';
import {
  policyCreateSchema,
  policyResponseSchema,
  policyUpdateSchema,
  policySearchQuerySchema,
  policyParamsSchema,
} from './policy.schema';
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
  router.addRoute({
    name: 'listPolicies',
    method: 'get',
    path: '/',
    summary: 'List all policies',
    handlers: [policyController.findAll],
    responses: swagger.list.responses,
    tags: ['Policies'],
  });

  // POST /policies - Create policy
  router.addRoute({
    name: 'createPolicy',
    method: 'post',
    path: '/',
    summary: 'Create policy',
    handlers: [policyController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Policies'],
  });

  // GET /policies/search - Search policy by name
  router.addRoute({
    name: 'searchPolicy',
    method: 'get',
    path: '/search',
    summary: 'Search policy by name',
    handlers: [policyController.findByName],
    request: {
      query: policySearchQuerySchema,
    },
    responses: swagger.search.responses,
    tags: ['Policies'],
  });

  // GET /policies/:id - Get policy by ID
  router.addRoute({
    name: 'getPolicyById',
    method: 'get',
    path: '/:id',
    summary: 'Get policy by ID',
    handlers: [policyController.findById],
    request: {
      params: policyParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Policies'],
  });

  // PUT /policies/:id - Update policy
  router.addRoute({
    name: 'updatePolicy',
    method: 'put',
    path: '/:id',
    summary: 'Update policy',
    handlers: [policyController.update],
    request: {
      params: policyParamsSchema,
      ...swagger.update.request,
    },
    responses: swagger.update.responses,
    tags: ['Policies'],
  });

  // DELETE /policies/:id - Remove policy
  router.addRoute({
    name: 'removePolicy',
    method: 'delete',
    path: '/:id',
    summary: 'Remove policy',
    handlers: [policyController.remove],
    request: {
      params: policyParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Policies'],
  });

  return router;
};
