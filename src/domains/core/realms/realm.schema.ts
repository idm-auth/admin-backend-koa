import {
  DocIdSchema,
  publicUUIDSchema,
} from '@/domains/commons/base/base.schema';
import {
  createPaginatedResponseSchema,
  paginationQuerySchema,
} from '@/domains/commons/base/pagination.schema';
import { requestIDParamsSchema } from '@/domains/commons/base/request.schema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const realmCreateSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Name contains invalid characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .regex(/^[a-zA-Z0-9\s.,!?_-]*$/, 'Description contains invalid characters')
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  dbName: z
    .string({ error: 'Database name is required' })
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Database name can only contain letters, numbers, underscores and hyphens'
    )
    .max(50, 'Database name must be at most 50 characters'),
  jwtConfig: z
    .object({
      expiresIn: z
        .string({ error: 'JWT expires in is required' })
        .default('24h'),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: z
    .string()
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Name contains invalid characters')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  description: z
    .string()
    .regex(/^[a-zA-Z0-9\s.,!?_-]*$/, 'Description contains invalid characters')
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  dbName: z
    .string()
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Database name can only contain letters, numbers, underscores and hyphens'
    )
    .max(50, 'Database name must be at most 50 characters')
    .optional(),
  jwtConfig: z
    .object({
      expiresIn: z.string().optional(),
    })
    .optional(),
});

// Response schemas
export const realmBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional().nullish(),
  publicUUID: publicUUIDSchema,
});

export const realmCreateResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
});

export const realmUpdateResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
});

export const realmListItemResponseSchema = realmBaseResponseSchema;

export const realmReadResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
});

export const realmListResponseSchema = z.array(realmListItemResponseSchema);

export const realmSearchResponseSchema = realmReadResponseSchema;

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmBaseResponse = z.infer<typeof realmBaseResponseSchema>;
export type RealmCreateResponse = z.infer<typeof realmCreateResponseSchema>;
export type RealmUpdateResponse = z.infer<typeof realmUpdateResponseSchema>;
export type RealmListItemResponse = z.infer<typeof realmListItemResponseSchema>;
export type RealmReadResponse = z.infer<typeof realmReadResponseSchema>;
export type RealmListResponse = z.infer<typeof realmListResponseSchema>;
export type RealmSearchResponse = z.infer<typeof realmSearchResponseSchema>;

export type RealmParams = z.infer<typeof requestIDParamsSchema>;

// Pagination schemas
export const realmListQuerySchema = paginationQuerySchema;
export const realmPaginatedResponseSchema = createPaginatedResponseSchema(
  realmListItemResponseSchema
);

export type RealmListQuery = z.infer<typeof realmListQuerySchema>;
export type RealmPaginatedResponse = z.infer<
  typeof realmPaginatedResponseSchema
>;
