import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema, publicUUIDSchema } from './base.schema';

extendZodWithOpenApi(z);

// Common params schema for ID-based routes
export const requestIDParamsSchema = z.object({
  id: DocIdSchema,
});

export type RequestIDParams = z.infer<typeof requestIDParamsSchema>;

// Params schemas
export const requestTenantIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
});

export type RequestTenantIdParams = z.infer<typeof requestTenantIdParamsSchema>;

export const requestTenantIdAndIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  id: DocIdSchema,
});

export type RequestTenantIdAndIdParams = z.infer<
  typeof requestTenantIdAndIdParamsSchema
>;
