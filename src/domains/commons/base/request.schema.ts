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

export const requestPublicUUIDParamsSchema = z.object({
  publicUUID: publicUUIDSchema,
});

export type RequestPublicUUIDParams = z.infer<
  typeof requestPublicUUIDParamsSchema
>;

export const requestTenantIdAndAccountIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  accountId: DocIdSchema,
});

export type RequestTenantIdAndAccountIdParams = z.infer<
  typeof requestTenantIdAndAccountIdParamsSchema
>;

export const requestTenantIdAndGroupIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  groupId: DocIdSchema,
});

export type RequestTenantIdAndGroupIdParams = z.infer<
  typeof requestTenantIdAndGroupIdParamsSchema
>;

export const requestTenantIdAndRoleIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  roleId: DocIdSchema,
});

export type RequestTenantIdAndRoleIdParams = z.infer<
  typeof requestTenantIdAndRoleIdParamsSchema
>;

export const requestTenantIdAndPolicyIdParamsSchema = z.object({
  tenantId: publicUUIDSchema,
  policyId: DocIdSchema,
});

export type RequestTenantIdAndPolicyIdParams = z.infer<
  typeof requestTenantIdAndPolicyIdParamsSchema
>;
