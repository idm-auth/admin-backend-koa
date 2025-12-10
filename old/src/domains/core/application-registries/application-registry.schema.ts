import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DocIdSchema } from '@/domains/commons/base/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const applicationRegistryCreateSchema = z.object({
  tenantId: DocIdSchema,
  applicationId: DocIdSchema,
});

export const applicationRegistryUpdateSchema = z.object({
  applicationKey: DocIdSchema.optional(),
  tenantId: DocIdSchema.optional(),
  applicationId: DocIdSchema.optional(),
});

export const applicationRegistryBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  applicationKey: DocIdSchema,
  tenantId: DocIdSchema,
  applicationId: DocIdSchema,
});

export const applicationRegistryCreateResponseSchema =
  applicationRegistryBaseResponseSchema;
export const applicationRegistryUpdateResponseSchema =
  applicationRegistryBaseResponseSchema;
export const applicationRegistryListItemResponseSchema =
  applicationRegistryBaseResponseSchema;
export const applicationRegistryReadResponseSchema =
  applicationRegistryBaseResponseSchema;

export type ApplicationRegistryCreate = z.infer<
  typeof applicationRegistryCreateSchema
>;
export type ApplicationRegistryUpdate = z.infer<
  typeof applicationRegistryUpdateSchema
>;
export type ApplicationRegistryBaseResponse = z.infer<
  typeof applicationRegistryBaseResponseSchema
>;
export type ApplicationRegistryCreateResponse = z.infer<
  typeof applicationRegistryCreateResponseSchema
>;
export type ApplicationRegistryUpdateResponse = z.infer<
  typeof applicationRegistryUpdateResponseSchema
>;
export type ApplicationRegistryListItemResponse = z.infer<
  typeof applicationRegistryListItemResponseSchema
>;
export type ApplicationRegistryReadResponse = z.infer<
  typeof applicationRegistryReadResponseSchema
>;

export const applicationRegistryListQuerySchema = paginationQuerySchema;
export const applicationRegistryPaginatedResponseSchema =
  createPaginatedResponseSchema(applicationRegistryListItemResponseSchema);

export type ApplicationRegistryListQuery = z.infer<
  typeof applicationRegistryListQuerySchema
>;
export type ApplicationRegistryPaginatedResponse = z.infer<
  typeof applicationRegistryPaginatedResponseSchema
>;
