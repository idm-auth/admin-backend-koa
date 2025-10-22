import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  DocIdSchema,
  publicUUIDSchema,
} from '@/domains/commons/base/latest/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/latest/pagination.schema';
import { requestIDParamsSchema } from '@/domains/commons/base/latest/request.schema';

extendZodWithOpenApi(z);

export const realmCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  dbName: z.string({ error: 'Database name is required' }),
  jwtConfig: z
    .object({
      secret: z
        .string({ error: 'JWT secret is required' })
        .default('default-super-secret-jwt-key-change-in-production'),
      expiresIn: z
        .string({ error: 'JWT expires in is required' })
        .default('24h'),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  dbName: z.string().optional(),
  jwtConfig: z
    .object({
      secret: z.string().optional(),
      expiresIn: z.string().optional(),
    })
    .optional(),
});

// Response schemas
export const realmBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
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

// Mantendo para compatibilidade
export const realmResponseSchema = realmCreateResponseSchema;

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmBaseResponse = z.infer<typeof realmBaseResponseSchema>;
export type RealmCreateResponse = z.infer<typeof realmCreateResponseSchema>;
export type RealmUpdateResponse = z.infer<typeof realmUpdateResponseSchema>;
export type RealmListItemResponse = z.infer<typeof realmListItemResponseSchema>;
export type RealmResponse = z.infer<typeof realmResponseSchema>;

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
