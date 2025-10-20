import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
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
export const realmResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  publicUUID: z.string(),
  dbName: z.string(),
  jwtConfig: z.object({
    secret: z.string(),
    expiresIn: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

// Params schemas
export const realmPublicUUIDParamsSchema = z.object({
  publicUUID: z.string(),
});

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmResponse = z.infer<typeof realmResponseSchema>;

export type RealmParams = z.infer<typeof requestIDParamsSchema>;
export type RealmPublicUUIDParams = z.infer<typeof realmPublicUUIDParamsSchema>;

// Pagination schemas
export const realmListQuerySchema = paginationQuerySchema;
export const realmPaginatedResponseSchema =
  createPaginatedResponseSchema(realmResponseSchema);

export type RealmListQuery = z.infer<typeof realmListQuerySchema>;
export type RealmPaginatedResponse = z.infer<
  typeof realmPaginatedResponseSchema
>;
