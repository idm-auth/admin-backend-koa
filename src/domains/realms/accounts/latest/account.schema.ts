import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  emailSchema,
  passwordSchema,
} from '@/domains/commons/base/v1/base.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/latest/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Response schemas
export const accountBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  email: emailSchema,
});

export const accountCreateResponseSchema = accountBaseResponseSchema;

export const accountUpdateResponseSchema = accountBaseResponseSchema;

export const accountListItemResponseSchema = accountBaseResponseSchema;

export const accountReadResponseSchema = accountBaseResponseSchema;

export const accountListResponseSchema = z.array(accountListItemResponseSchema);

export const accountSearchResponseSchema = accountReadResponseSchema;

export const accountUpdateSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});

export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountBaseResponse = z.infer<typeof accountBaseResponseSchema>;
export type AccountCreateResponse = z.infer<typeof accountCreateResponseSchema>;
export type AccountUpdateResponse = z.infer<typeof accountUpdateResponseSchema>;
export type AccountListItemResponse = z.infer<
  typeof accountListItemResponseSchema
>;
export type AccountReadResponse = z.infer<typeof accountReadResponseSchema>;
export type AccountListResponse = z.infer<typeof accountListResponseSchema>;
export type AccountSearchResponse = z.infer<typeof accountSearchResponseSchema>;
export type AccountUpdate = z.infer<typeof accountUpdateSchema>;

// Pagination schemas
export const accountListQuerySchema = paginationQuerySchema;
export const accountPaginatedResponseSchema = createPaginatedResponseSchema(
  accountListItemResponseSchema
);

export type AccountListQuery = z.infer<typeof accountListQuerySchema>;
export type AccountPaginatedResponse = z.infer<
  typeof accountPaginatedResponseSchema
>;
