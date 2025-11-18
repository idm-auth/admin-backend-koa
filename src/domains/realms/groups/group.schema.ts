import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  DocIdSchema,
  nameSchema,
  descriptionSchema,
} from '@/domains/commons/base/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const groupCreateSchema = z.object({
  name: nameSchema,
  description: descriptionSchema.optional(),
});

// Response schemas
export const groupBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional().nullish(),
});

export const groupCreateResponseSchema = groupBaseResponseSchema;

export const groupUpdateResponseSchema = groupBaseResponseSchema;

export const groupListItemResponseSchema = groupBaseResponseSchema;

export const groupReadResponseSchema = groupBaseResponseSchema;

export const groupListResponseSchema = z.array(groupListItemResponseSchema);

export const groupSearchResponseSchema = groupReadResponseSchema;

export const groupUpdateSchema = z.object({
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
});

export type GroupCreate = z.infer<typeof groupCreateSchema>;
export type GroupBaseResponse = z.infer<typeof groupBaseResponseSchema>;
export type GroupCreateResponse = z.infer<typeof groupCreateResponseSchema>;
export type GroupUpdateResponse = z.infer<typeof groupUpdateResponseSchema>;
export type GroupListItemResponse = z.infer<typeof groupListItemResponseSchema>;
export type GroupReadResponse = z.infer<typeof groupReadResponseSchema>;
export type GroupListResponse = z.infer<typeof groupListResponseSchema>;
export type GroupSearchResponse = z.infer<typeof groupSearchResponseSchema>;
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;

// Pagination schemas
export const groupListQuerySchema = paginationQuerySchema;
export const groupPaginatedResponseSchema = createPaginatedResponseSchema(
  groupListItemResponseSchema
);

export type GroupListQuery = z.infer<typeof groupListQuerySchema>;
export type GroupPaginatedResponse = z.infer<typeof groupPaginatedResponseSchema>;
