import { MagicRouter } from '@/utils/core/MagicRouter';
import * as realmController from './realm.controller';
import {
  realmCreateSchema,
  realmUpdateSchema,
  realmResponseSchema,
  realmSearchByNameSchema,
  realmParamsSchema,
  realmPublicUUIDParamsSchema,
} from './realm.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realms' });
  const swagger = createCrudSwagger(
    'Realm',
    realmResponseSchema,
    realmCreateSchema,
    realmUpdateSchema
  );

  // GET /realms - List all realms
  router.addRoute({
    name: 'listRealms',
    method: 'get',
    path: '/',
    summary: 'List all realms',
    handlers: [realmController.findAll],
    responses: swagger.list.responses,
    tags: ['Realms'],
  });

  // POST /realms - Create realm
  router.addRoute({
    name: 'createRealm',
    method: 'post',
    path: '/',
    summary: 'Create realm',
    handlers: [realmController.create],
    request: swagger.create.request,
    responses: swagger.create.responses,
    tags: ['Realms'],
  });

  // GET /realms/publicUUID/:publicUUID - Get realm by publicUUID
  router.addRoute({
    name: 'getRealmByPublicUUID',
    method: 'get',
    path: '/publicUUID/:publicUUID',
    summary: 'Get realm by publicUUID',
    handlers: [realmController.findByPublicUUID],
    request: {
      params: realmPublicUUIDParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Realms'],
  });

  // GET /realms/search/name - Search realm by name
  router.addRoute({
    name: 'searchRealmByName',
    method: 'get',
    path: '/search/name',
    summary: 'Search realm by name',
    handlers: [realmController.findByName],
    request: {
      query: realmSearchByNameSchema,
    },
    responses: swagger.search.responses,
    tags: ['Realms'],
  });

  // GET /realms/:id - Get realm by ID
  router.addRoute({
    name: 'getRealmById',
    method: 'get',
    path: '/:id',
    summary: 'Get realm by ID',
    handlers: [realmController.findById],
    request: {
      params: realmParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Realms'],
  });

  // PUT /realms/:id - Update realm
  router.addRoute({
    name: 'updateRealm',
    method: 'put',
    path: '/:id',
    summary: 'Update realm',
    handlers: [realmController.update],
    request: {
      params: realmParamsSchema,
      ...swagger.update.request,
    },
    responses: swagger.update.responses,
    tags: ['Realms'],
  });

  // DELETE /realms/:id - Remove realm
  router.addRoute({
    name: 'removeRealm',
    method: 'delete',
    path: '/:id',
    summary: 'Remove realm',
    handlers: [realmController.remove],
    request: {
      params: realmParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Realms'],
  });

  return router;
};
