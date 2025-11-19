import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';
import { requestIDParamsSchema } from '@/domains/commons/base/request.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';

extendZodWithOpenApi(z);

export const roleCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// Response schemas
export const roleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const roleCreateResponseSchema = roleBaseResponseSchema;
export const roleUpdateResponseSchema = roleBaseResponseSchema;
export const roleReadResponseSchema = roleBaseResponseSchema;
export const roleListItemResponseSchema = roleBaseResponseSchema;
export const roleListResponseSchema = z.array(roleListItemResponseSchema);
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
export type RoleListItemResponse = z.infer<typeof roleListItemResponseSchema>;
export type RoleListResponse = z.infer<typeof roleListResponseSchema>;
export type RoleSearchResponse = z.infer<typeof roleSearchResponseSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;

export type RoleParams = z.infer<typeof requestIDParamsSchema>;

// Pagination schemas
export const roleListQuerySchema = paginationQuerySchema;
export const rolePaginatedResponseSchema = createPaginatedResponseSchema(
  roleListItemResponseSchema
);

export type RoleListQuery = z.infer<typeof roleListQuerySchema>;
export type RolePaginatedResponse = z.infer<typeof rolePaginatedResponseSchema>;
