import { MagicRouter } from '@/utils/core/MagicRouter';
import * as realmController from './realm.controller';
import {
  realmCreateSchema,
  realmUpdateSchema,
  realmResponseSchema,
  realmPublicUUIDParamsSchema,
  realmListQuerySchema,
  realmPaginatedResponseSchema,
} from './realm.schema';
import { requestIDParamsSchema } from '@/domains/commons/base/latest/request.schema';
import { createCrudSwagger } from '@/utils/crudSwagger.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realms' });
  const swagger = createCrudSwagger(
    'Realm',
    realmResponseSchema,
    realmCreateSchema,
    realmUpdateSchema,
    realmPaginatedResponseSchema
  );

  // GET /realms - List all realms (paginated)
  router.get({
    name: 'listRealms',
    path: '/',
    summary: 'List all realms with pagination',
    handlers: [realmController.findAllPaginated],
    request: {
      query: realmListQuerySchema,
    },
    responses: swagger.listPaginated.responses,
    tags: ['Realms'],
  });

  // POST /realms - Create realm
  router.post({
    name: 'createRealm',
    path: '/',
    summary: 'Create realm',
    handlers: [realmController.create],
    request: {
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Realms'],
  });

  // GET /realms/publicUUID/:publicUUID - Get realm by publicUUID
  router.get({
    name: 'getRealmByPublicUUID',
    path: '/publicUUID/:publicUUID',
    summary: 'Get realm by publicUUID',
    handlers: [realmController.findByPublicUUID],
    request: {
      params: realmPublicUUIDParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Realms'],
  });

  // GET /realms/:id - Get realm by ID
  router.get({
    name: 'getRealmById',
    path: '/:id',
    summary: 'Get realm by ID',
    handlers: [realmController.findById],
    request: {
      params: requestIDParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Realms'],
  });

  // PUT /realms/:id - Update realm
  router.put({
    name: 'updateRealm',
    path: '/:id',
    summary: 'Update realm',
    handlers: [realmController.update],
    request: {
      params: requestIDParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Realms'],
  });

  // DELETE /realms/:id - Remove realm
  router.delete({
    name: 'removeRealm',
    path: '/:id',
    summary: 'Remove realm',
    handlers: [realmController.remove],
    request: {
      params: requestIDParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Realms'],
  });

  return router;
};
