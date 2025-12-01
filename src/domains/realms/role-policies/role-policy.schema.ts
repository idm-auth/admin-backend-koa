import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const rolePolicyCreateSchema = z.object({
  roleId: DocIdSchema,
  policyId: DocIdSchema,
});

export const rolePolicyRemoveSchema = z.object({
  roleId: DocIdSchema,
  policyId: DocIdSchema,
});

export const rolePolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  roleId: DocIdSchema,
  policyId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const rolePolicyListResponseSchema = z.array(
  rolePolicyBaseResponseSchema
);

export type RolePolicyCreate = z.infer<typeof rolePolicyCreateSchema>;
export type RolePolicyRemove = z.infer<typeof rolePolicyRemoveSchema>;
export type RolePolicyBaseResponse = z.infer<
  typeof rolePolicyBaseResponseSchema
>;
export type RolePolicyListResponse = z.infer<
  typeof rolePolicyListResponseSchema
>;
