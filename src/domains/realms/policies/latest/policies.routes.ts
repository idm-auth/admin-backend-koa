import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as policyController from './policy.controller';
import { policyCreateSchema } from './policy.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

extendZodWithOpenApi(z);

// Response schemas
const policyResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.record(z.string(), z.any()).optional(),
});

const policyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']).optional(),
  actions: z.array(z.string()).optional(),
  resources: z.array(z.string()).optional(),
  conditions: z.record(z.string(), z.string()).optional(),
});

// Query schemas
const policySearchQuerySchema = z.object({
  name: z.string(),
});

// Params schemas
const policyParamsSchema = z.object({
  id: DocIdSchema,
});

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
