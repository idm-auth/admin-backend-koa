import { requestIDParamsSchema } from '@/domains/commons/base/request.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';
import * as applicationRegistryController from './application-registry.controller';
import {
  applicationRegistryCreateResponseSchema,
  applicationRegistryCreateSchema,
  applicationRegistryListQuerySchema,
  applicationRegistryPaginatedResponseSchema,
  applicationRegistryReadResponseSchema,
  applicationRegistryUpdateResponseSchema,
  applicationRegistryUpdateSchema,
} from './application-registry.schema';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/application-registries' });
  const swagger = createCrudSwagger(
    'ApplicationRegistry',
    applicationRegistryCreateSchema,
    applicationRegistryUpdateSchema,
    applicationRegistryCreateResponseSchema,
    applicationRegistryUpdateResponseSchema,
    applicationRegistryReadResponseSchema,
    applicationRegistryPaginatedResponseSchema
  );

  router.get({
    name: 'listApplicationRegistries',
    path: '/',
    summary: 'List all application registries with pagination',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.findAllPaginated],
    request: {
      query: applicationRegistryListQuerySchema,
    },
    responses: swagger.listPaginated.responses,
    tags: ['Application Registries'],
  });

  router.post({
    name: 'createApplicationRegistry',
    path: '/',
    summary: 'Create application registry',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.create],
    request: {
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Application Registries'],
  });

  router.get({
    name: 'getApplicationRegistryByKey',
    path: '/key/:applicationKey',
    summary: 'Get application registry by key',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.findByApplicationKey],
    request: {
      params: z.object({ applicationKey: z.string() }),
    },
    responses: swagger.read.responses,
    tags: ['Application Registries'],
  });

  router.get({
    name: 'getApplicationRegistryById',
    path: '/:id',
    summary: 'Get application registry by ID',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.findById],
    request: {
      params: requestIDParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Application Registries'],
  });

  router.put({
    name: 'updateApplicationRegistry',
    path: '/:id',
    summary: 'Update application registry',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.update],
    request: {
      params: requestIDParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Application Registries'],
  });

  router.delete({
    name: 'removeApplicationRegistry',
    path: '/:id',
    summary: 'Remove application registry',
    authentication: { someOneMethod: true },
    handlers: [applicationRegistryController.remove],
    request: {
      params: requestIDParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Application Registries'],
  });

  return router;
};
