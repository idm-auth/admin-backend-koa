import {
  requestTenantIdAndIdParamsSchema,
  requestTenantIdParamsSchema,
} from '@/domains/commons/base/request.schema';
import { MagicRouter } from '@/utils/core/MagicRouter';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';
import * as groupController from './group.controller';
import {
  groupCreateResponseSchema,
  groupCreateSchema,
  groupPaginatedResponseSchema,
  groupReadResponseSchema,
  groupUpdateResponseSchema,
  groupUpdateSchema,
} from './group.schema';

// Safe query schema that prevents SSRF by restricting filter values
const safeGroupListQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  filter: z
    .string()
    .regex(/^[a-zA-Z0-9\s._-]*$/, 'Invalid filter format')
    .max(100)
    .optional(),
  sortBy: z.enum(['name', 'description', 'createdAt', 'updatedAt']).optional(),
  descending: z.coerce.boolean().default(false),
});

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/groups' });
  const swagger = createCrudSwagger(
    'Group',
    groupCreateSchema,
    groupUpdateSchema,
    groupCreateResponseSchema,
    groupUpdateResponseSchema,
    groupReadResponseSchema,
    groupPaginatedResponseSchema
  );

  // GET /groups - List all groups (paginated)
  router.get({
    name: 'listGroups',
    path: '/',
    summary: 'List all groups with pagination',
    handlers: [groupController.findAllPaginated],
    request: {
      params: requestTenantIdParamsSchema,
      query: safeGroupListQuerySchema,
    },
    responses: swagger.listPaginated.responses,
    tags: ['Groups'],
  });

  // POST /groups - Create group
  router.post({
    name: 'createGroup',
    path: '/',
    summary: 'Create group',
    handlers: [groupController.create],
    request: {
      params: requestTenantIdParamsSchema,
      body: swagger.create.request.body,
    },
    responses: swagger.create.responses,
    tags: ['Groups'],
  });

  // GET /groups/:id - Get group by ID
  router.get({
    name: 'getGroupById',
    path: '/:id',
    summary: 'Get group by ID',
    handlers: [groupController.findById],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.read.responses,
    tags: ['Groups'],
  });

  // PUT /groups/:id - Update group
  router.put({
    name: 'updateGroup',
    path: '/:id',
    summary: 'Update group',
    handlers: [groupController.update],
    request: {
      params: requestTenantIdAndIdParamsSchema,
      body: swagger.update.request.body,
    },
    responses: swagger.update.responses,
    tags: ['Groups'],
  });

  // DELETE /groups/:id - Remove group
  router.delete({
    name: 'removeGroup',
    path: '/:id',
    summary: 'Remove group',
    handlers: [groupController.remove],
    request: {
      params: requestTenantIdAndIdParamsSchema,
    },
    responses: swagger.delete.responses,
    tags: ['Groups'],
  });

  return router;
};
