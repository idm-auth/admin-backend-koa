import { MagicRouter } from '@/utils/core/MagicRouter';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import * as realmController from './realm.controller';

extendZodWithOpenApi(z);
import { realmCreateSchema, realmUpdateSchema } from './realm.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { createCrudSwagger } from '@/utils/route-responses.util';

// Response schemas
const realmResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  publicUUID: z.string(),
  dbName: z.string(),
});

// Query schemas
const realmSearchByPublicUUIDSchema = z.object({
  publicUUID: z.string(),
});

const realmSearchByNameSchema = z.object({
  name: z.string(),
});

// Params schemas
const realmParamsSchema = z.object({
  id: DocIdSchema,
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realms' });
  const swagger = createCrudSwagger(
    'Realm',
    realmResponseSchema,
    realmCreateSchema,
    realmUpdateSchema
  );

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

  // GET /realms/search/publicUUID - Search realm by publicUUID
  router.addRoute({
    name: 'searchRealmByPublicUUID',
    method: 'get',
    path: '/search/publicUUID',
    summary: 'Search realm by publicUUID',
    handlers: [realmController.findByPublicUUID],
    request: {
      query: realmSearchByPublicUUIDSchema,
    },
    responses: swagger.search.responses,
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
