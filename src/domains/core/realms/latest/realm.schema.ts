import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

export const realmCreateSchema = z.object({
  name: z.string({ message: 'Name is required' }),
  dbName: z.string({ message: 'Database name is required' }),
  jwtConfig: z
    .object({
      secret: z.string().optional(),
      expiresIn: z.string().optional(),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: z.string().optional(),
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
  id: DocIdSchema,
  name: z.string(),
  publicUUID: z.string(),
  dbName: z.string(),
});

// Query schemas
export const realmSearchByNameSchema = z.object({
  name: z.string(),
});

// Params schemas
export const realmParamsSchema = z.object({
  id: DocIdSchema,
});

export const realmPublicUUIDParamsSchema = z.object({
  publicUUID: z.string(),
});

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmResponse = z.infer<typeof realmResponseSchema>;
export type RealmSearchByName = z.infer<typeof realmSearchByNameSchema>;
export type RealmParams = z.infer<typeof realmParamsSchema>;
export type RealmPublicUUIDParams = z.infer<typeof realmPublicUUIDParamsSchema>;
