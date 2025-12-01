import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const groupPolicyCreateSchema = z.object({
  groupId: DocIdSchema,
  policyId: DocIdSchema,
});

export const groupPolicyRemoveSchema = z.object({
  groupId: DocIdSchema,
  policyId: DocIdSchema,
});

export const groupPolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  groupId: DocIdSchema,
  policyId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const groupPolicyListResponseSchema = z.array(
  groupPolicyBaseResponseSchema
);

export type GroupPolicyCreate = z.infer<typeof groupPolicyCreateSchema>;
export type GroupPolicyRemove = z.infer<typeof groupPolicyRemoveSchema>;
export type GroupPolicyBaseResponse = z.infer<
  typeof groupPolicyBaseResponseSchema
>;
export type GroupPolicyListResponse = z.infer<
  typeof groupPolicyListResponseSchema
>;
