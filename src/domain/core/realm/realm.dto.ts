import {
  DocIdSchema,
  DtoTypes,
} from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

const expiresInSchema = z
  .string()
  .regex(/^\d+[smhd]$/, 'Invalid time format (e.g., 24h, 7d)');

export const realmCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  dbName: z.string().min(1),
  jwtConfig: z
    .object({
      expiresIn: expiresInSchema.default('24h'),
    })
    .optional(),
});

export const realmUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  jwtConfig: z
    .object({
      expiresIn: expiresInSchema.optional(),
    })
    .optional(),
});

const jwtConfigResponseSchema = z.object({
  secret: z.string(),
  expiresIn: z.string(),
});

export const realmBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  publicUUID: z.string().uuid(),
});

export const realmFullResponseSchema = realmBaseResponseSchema.extend({
  dbName: z.string(),
  jwtConfig: jwtConfigResponseSchema,
});

export const realmListItemResponseSchema = realmBaseResponseSchema;

export type RealmCreate = z.infer<typeof realmCreateSchema>;
export type RealmUpdate = z.infer<typeof realmUpdateSchema>;
export type RealmBaseResponse = z.infer<typeof realmBaseResponseSchema>;
export type RealmFullResponse = z.infer<typeof realmFullResponseSchema>;
export type RealmListItemResponse = z.infer<typeof realmListItemResponseSchema>;

export interface RealmDtoTypes extends DtoTypes {
  CreateRequestDto: RealmCreate;
  CreateResponseDto: RealmFullResponse;
  FindByIdResponseDto: RealmFullResponse;
  FindOneResponseDto: RealmFullResponse;
  FindAllResponseDto: RealmListItemResponse[];
  UpdateRequestDto: RealmUpdate;
  UpdateResponseDto: RealmFullResponse;
  DeleteResponseDto: RealmFullResponse;
  PaginatedItemDto: RealmListItemResponse;
}
