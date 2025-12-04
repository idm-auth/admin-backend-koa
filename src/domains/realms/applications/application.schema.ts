import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DocIdSchema } from '@/domains/commons/base/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const applicationCreateSchema = z.object({
  name: z.string().min(1),
});

export const applicationBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  applicationSecret: z.string(),
  applicationKey: DocIdSchema,
});

export const applicationCreateResponseSchema = applicationBaseResponseSchema;
export const applicationUpdateResponseSchema = applicationBaseResponseSchema;
export const applicationListItemResponseSchema = applicationBaseResponseSchema;
export const applicationReadResponseSchema = applicationBaseResponseSchema;

export const applicationUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});

export type ApplicationCreate = z.infer<typeof applicationCreateSchema>;
export type ApplicationBaseResponse = z.infer<
  typeof applicationBaseResponseSchema
>;
export type ApplicationCreateResponse = z.infer<
  typeof applicationCreateResponseSchema
>;
export type ApplicationUpdateResponse = z.infer<
  typeof applicationUpdateResponseSchema
>;
export type ApplicationListItemResponse = z.infer<
  typeof applicationListItemResponseSchema
>;
export type ApplicationReadResponse = z.infer<
  typeof applicationReadResponseSchema
>;
export type ApplicationUpdate = z.infer<typeof applicationUpdateSchema>;

export const applicationListQuerySchema = paginationQuerySchema;
export const applicationPaginatedResponseSchema = createPaginatedResponseSchema(
  applicationListItemResponseSchema
);

export type ApplicationListQuery = z.infer<typeof applicationListQuerySchema>;
export type ApplicationPaginatedResponse = z.infer<
  typeof applicationPaginatedResponseSchema
>;
