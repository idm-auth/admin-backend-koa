import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';
import * as applicationController from './application.controller';
import {
  applicationCreateResponseSchema,
  applicationCreateSchema,
  applicationPaginatedResponseSchema,
  applicationReadResponseSchema,
  applicationUpdateResponseSchema,
  applicationUpdateSchema,
} from './application.schema';

const safeApplicationListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  filter: z
    .string()
    .regex(/^[a-zA-Z0-9\s._-]*$/, 'Invalid filter format')
    .max(100)
    .optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  descending: z.coerce.boolean().default(false),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/applications' });
  const swagger = createCrudSwagger(
    'Application',
    applicationCreateSchema,
    applicationUpdateSchema,
    applicationCreateResponseSchema,
    applicationUpdateResponseSchema,
    applicationReadResponseSchema,
    applicationPaginatedResponseSchema
  );

  router.get({
    name: 'listApplications',
    path: '/',
    summary: 'List all applications with pagination',
    authentication: { someOneMethod: true },
    handlers: [applicationController.findAllPaginated],
    request: {
      params: requestTenantIdParamsSchema,
      query: safeApplicationListQuerySchema,
    },
    responses: swagger.listPaginated.responses,
    tags: ['Applications'],
  });

  router.post({
    name: 'createApplication',
    path: '/',
    summary: 'Create application',
    authentication: { someOneMethod: true },
    handlers: [applicationController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Applications'],
  });

  router.get({
    name: 'getApplicationById',
    path: '/:id',
    summary: 'Get application by ID',
    authentication: { someOneMethod: true },
    handlers: [applicationController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Applications'],
  });

  router.put({
    name: 'updateApplication',
    path: '/:id',
    summary: 'Update application',
    authentication: { someOneMethod: true },
    handlers: [applicationController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: {
        content: { 'application/json': { schema: applicationUpdateSchema } },
      },
    },
    responses: swagger.update.responses,
    tags: ['Applications'],
  });

  router.delete({
    name: 'removeApplication',
    path: '/:id',
    summary: 'Remove application',
    authentication: { someOneMethod: true },
    handlers: [applicationController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Applications'],
  });

  return router;
};
