import { SwaggerRouter } from '@/utils/swagger-router';
import * as swaggerPocController from '@/controllers/latest/swagger-poc.controller';
import {
  swaggerPocCreateSchema,
  swaggerPocResponseSchema,
  swaggerPocParamsSchema,
  swaggerPocQuerySchema,
  swaggerPocListResponseSchema,
  errorResponseSchema
} from '@/schemas/latest/swagger-poc.schema';

export const initialize = () => {
  const router = new SwaggerRouter({ prefix: '/v1' });
  
  // GET /users - List users with query validation
  router.addRoute({
    name: 'listUsers',
    method: 'get',
    path: '/users',
    handlers: [swaggerPocController.list],
    validate: {
      query: swaggerPocQuerySchema,
      response: swaggerPocListResponseSchema
    },
    tags: ['Users']
  });
  
  // POST /users - Create user with body validation
  router.addRoute({
    name: 'createUser',
    method: 'post',
    path: '/users',
    handlers: [swaggerPocController.create],
    validate: {
      body: swaggerPocCreateSchema,
      response: swaggerPocResponseSchema,
      responses: {
        400: errorResponseSchema
      }
    },
    tags: ['Users']
  });
  
  // GET /users/:id - Get user by ID
  router.addRoute({
    name: 'getUserById',
    method: 'get',
    path: '/users/:id',
    handlers: [swaggerPocController.findById],
    validate: {
      params: swaggerPocParamsSchema,
      response: swaggerPocResponseSchema,
      responses: {
        404: errorResponseSchema
      }
    },
    tags: ['Users']
  });
  
  return router;
};