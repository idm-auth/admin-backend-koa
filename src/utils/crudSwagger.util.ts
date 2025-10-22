import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
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
  content: {
    'application/json': {
      schema,
    },
  },
});

// Helpers para operações CRUD
export const createCrudSwagger = (
  entityName: string,
  responseSchema: z.ZodSchema,
  createSchema: z.ZodSchema,
  updateSchema: z.ZodSchema,
  paginatedResponseSchema?: z.ZodSchema,
  createResponseSchema?: z.ZodSchema,
  updateResponseSchema?: z.ZodSchema
) => ({
  create: {
    request: {
      body: createRequestBody(createSchema),
    },
    responses: {
      200: createSuccessResponse(
        `${entityName} created successfully`,
        createResponseSchema || responseSchema
      ),
      400: commonResponses.badRequest,
    },
  },
  list: {
    responses: {
      200: createSuccessResponse(
        `List of ${entityName.toLowerCase()}s`,
        z.array(responseSchema)
      ),
      400: commonResponses.badRequest,
    },
  },
  listPaginated: {
    responses: {
      200: createSuccessResponse(
        `Paginated list of ${entityName.toLowerCase()}s`,
        paginatedResponseSchema || z.array(responseSchema)
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
    request: {
      body: createRequestBody(updateSchema),
    },
    responses: {
      200: createSuccessResponse(
        `${entityName} updated successfully`,
        updateResponseSchema || responseSchema
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
