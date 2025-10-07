import { SwaggerRouter } from '@/utils/swagger-router';
import * as authenticationController from './authentication.controller';
import { loginRequestSchema, loginResponseSchema } from './authentication.schema';
import { errorResponseSchema } from '@/schemas/latest/base.schema';

export const initialize = async () => {
  const router = new SwaggerRouter({ prefix: '/authentication' });

  router.addRoute({
    name: 'login',
    method: 'post',
    path: '/login',
    handlers: [authenticationController.login],
    validate: {
      body: loginRequestSchema,
      response: loginResponseSchema,
      responses: {
        400: errorResponseSchema,
      },
    },
    tags: ['Authentication'],
  });

  return router;
};