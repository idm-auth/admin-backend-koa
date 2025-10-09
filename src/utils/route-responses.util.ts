import { z } from 'zod';
import { errorResponseSchema } from '@/domains/commons/base/latest/base.schema';

export const createSuccessResponse = (
  description: string,
  schema: z.ZodSchema
) => ({
  description,
  content: {
    'application/json': {
      schema,
    },
  },
});

export const createErrorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: errorResponseSchema,
    },
  },
});

export const createNoContentResponse = (description: string) => ({
  description,
});

// Padrões comuns de responses
export const commonResponses = {
  badRequest: createErrorResponse('Bad request'),
  notFound: createErrorResponse('Not found'),
  internalError: createErrorResponse('Internal server error'),
};

export const createRequestBody = (schema: z.ZodSchema) => ({
  body: {
    content: {
      'application/json': {
        schema,
      },
    },
  },
});

// Helpers para operações CRUD
export const createCrudSwagger = (
  entityName: string,
  responseSchema: z.ZodSchema,
  createSchema?: z.ZodSchema,
  updateSchema?: z.ZodSchema
) => ({
  create: {
    request: createSchema ? createRequestBody(createSchema) : undefined,
    responses: {
      200: createSuccessResponse(
        `${entityName} created successfully`,
        responseSchema
      ),
      400: commonResponses.badRequest,
    },
  },
  read: {
    responses: {
      200: createSuccessResponse(`${entityName} found`, responseSchema),
      400: commonResponses.badRequest,
      404: commonResponses.notFound,
    },
  },
  update: {
    request: updateSchema ? createRequestBody(updateSchema) : undefined,
    responses: {
      200: createSuccessResponse(
        `${entityName} updated successfully`,
        responseSchema
      ),
      400: commonResponses.badRequest,
      404: commonResponses.notFound,
    },
  },
  delete: {
    responses: {
      200: createNoContentResponse(`${entityName} removed successfully`),
      400: commonResponses.badRequest,
      404: commonResponses.notFound,
    },
  },
  search: {
    responses: {
      200: createSuccessResponse(`${entityName} found`, responseSchema),
      400: commonResponses.badRequest,
      404: commonResponses.notFound,
    },
  },
});
