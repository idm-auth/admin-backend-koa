import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const swaggerPocCreateSchema = z.object({
  name: z.string().min(1).openapi({ 
    example: 'John Doe',
    description: 'User name'
  }),
  email: z.string().email().openapi({ 
    example: 'john@example.com',
    description: 'User email address'
  }),
  age: z.number().min(18).max(100).openapi({ 
    example: 25,
    description: 'User age (18-100)'
  })
}).openapi('SwaggerPocCreate');

export const swaggerPocResponseSchema = z.object({
  id: z.string().openapi({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Generated user ID'
  }),
  name: z.string().openapi({ 
    example: 'John Doe',
    description: 'User name'
  }),
  email: z.string().email().openapi({ 
    example: 'john@example.com',
    description: 'User email'
  }),
  age: z.number().openapi({ 
    example: 25,
    description: 'User age'
  }),
  createdAt: z.string().datetime().openapi({ 
    example: '2024-01-01T00:00:00Z',
    description: 'Creation timestamp'
  })
}).openapi('SwaggerPocResponse');

export const swaggerPocParamsSchema = z.object({
  id: z.string().uuid().openapi({ 
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID'
  })
}).openapi('SwaggerPocParams');

export const swaggerPocQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(10).openapi({ 
    example: 10,
    description: 'Number of items to return'
  }),
  offset: z.coerce.number().min(0).optional().default(0).openapi({ 
    example: 0,
    description: 'Number of items to skip'
  })
}).openapi('SwaggerPocQuery');

export const swaggerPocListResponseSchema = z.object({
  users: z.array(swaggerPocResponseSchema).openapi({
    description: 'List of users'
  }),
  total: z.number().openapi({
    example: 1,
    description: 'Total number of users'
  }),
  limit: z.number().optional(),
  offset: z.number().optional()
}).openapi('SwaggerPocListResponse');

export const errorResponseSchema = z.object({
  error: z.string().openapi({ 
    example: 'Resource not found',
    description: 'Error message'
  }),
  details: z.string().optional().openapi({ 
    example: 'User with ID 123 not found',
    description: 'Additional error details'
  })
}).openapi('ErrorResponse');

export type SwaggerPocCreate = z.infer<typeof swaggerPocCreateSchema>;
export type SwaggerPocResponse = z.infer<typeof swaggerPocResponseSchema>;
export type SwaggerPocParams = z.infer<typeof swaggerPocParamsSchema>;
export type SwaggerPocQuery = z.infer<typeof swaggerPocQuerySchema>;