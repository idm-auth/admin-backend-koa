import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DocIdSchema, nameSchema } from '@/domains/commons/base/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

const availableActionSchema = z.object({
  resourceType: z.string().min(1, 'Resource type is required'),
  pathPattern: z
    .string()
    .min(1, 'Path pattern is required')
    .regex(/^\//, 'Path pattern must start with /'),
  operations: z
    .array(z.string().min(1))
    .min(1, 'At least one operation is required'),
});

export const applicationCreateSchema = z.object({
  name: nameSchema,
  systemId: z.string().min(1, 'System ID is required'),
  availableActions: z
    .array(availableActionSchema)
    .min(1, 'At least one action is required'),
});

export const applicationBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  name: z.string(),
  systemId: z.string(),
  availableActions: z.array(
    z.object({
      resourceType: z.string(),
      pathPattern: z.string(),
      operations: z.array(z.string()),
    })
  ),
  applicationSecret: z.string(),
  isActive: z.boolean(),
});

export const applicationCreateResponseSchema = applicationBaseResponseSchema;
export const applicationUpdateResponseSchema = applicationBaseResponseSchema;
export const applicationListItemResponseSchema = applicationBaseResponseSchema;
export const applicationReadResponseSchema = applicationBaseResponseSchema;

export const applicationUpdateSchema = z.object({
  name: nameSchema.optional(),
  availableActions: z.array(availableActionSchema).optional(),
  isActive: z.boolean().optional(),
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
