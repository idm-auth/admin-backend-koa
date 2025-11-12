import { z } from 'zod';
import {
  DocIdSchema,
  requestIDParamsSchema,
} from '@/domains/commons/base/base.schema';

export const roleCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// Response schemas
export const roleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const roleCreateResponseSchema = roleBaseResponseSchema;
export const roleUpdateResponseSchema = roleBaseResponseSchema;
export const roleReadResponseSchema = roleBaseResponseSchema;
export const roleListResponseSchema = z.array(roleBaseResponseSchema);
export const roleSearchResponseSchema = roleReadResponseSchema;

export const roleUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleBaseResponse = z.infer<typeof roleBaseResponseSchema>;
export type RoleCreateResponse = z.infer<typeof roleCreateResponseSchema>;
export type RoleUpdateResponse = z.infer<typeof roleUpdateResponseSchema>;
export type RoleReadResponse = z.infer<typeof roleReadResponseSchema>;
export type RoleListResponse = z.infer<typeof roleListResponseSchema>;
export type RoleSearchResponse = z.infer<typeof roleSearchResponseSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;

export type RoleParams = z.infer<typeof requestIDParamsSchema>;