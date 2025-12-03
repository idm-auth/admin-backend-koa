import {
  DocIdSchema,
  publicUUIDSchema,
  nameSchema,
  descriptionSchema,
  dbNameSchema,
} from '@/domains/commons/base/base.schema';
import {
  createPaginatedResponseSchema,
  paginationQuerySchema,
} from '@/domains/commons/base/pagination.schema';
import { requestIDParamsSchema } from '@/domains/commons/base/request.schema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import ms from 'ms';

extendZodWithOpenApi(z);

const expiresInSchema = z.string().refine(
  (val) => typeof ms(val as ms.StringValue) === 'number',
  { message: 'Invalid time format' }
);

export const realmCreateSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
  dbName: dbNameSchema,
  jwtConfig: z
    .object({
      expiresIn: expiresInSchema.default('24h'),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  dbName: dbNameSchema.optional(),
  jwtConfig: z
    .object({
      expiresIn: expiresInSchema.optional(),
    })
    .optional(),
});

// Response schemas
const jwtConfigResponseSchema = z.object({
  secret: z.string(),
  expiresIn: expiresInSchema,
});

export const realmBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional().nullish(),
  publicUUID: publicUUIDSchema,
});

export const realmCreateResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: jwtConfigResponseSchema,
});

export const realmUpdateResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: jwtConfigResponseSchema,
});

export const realmListItemResponseSchema = realmBaseResponseSchema;

export const realmReadResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: jwtConfigResponseSchema,
});

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmBaseResponse = z.infer<typeof realmBaseResponseSchema>;
export type RealmCreateResponse = z.infer<typeof realmCreateResponseSchema>;
export type RealmUpdateResponse = z.infer<typeof realmUpdateResponseSchema>;
export type RealmListItemResponse = z.infer<typeof realmListItemResponseSchema>;
export type RealmReadResponse = z.infer<typeof realmReadResponseSchema>;

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
