import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const accountPolicyCreateSchema = z.object({
  accountId: DocIdSchema,
  policyId: DocIdSchema,
});

export const accountPolicyRemoveSchema = z.object({
  accountId: DocIdSchema,
  policyId: DocIdSchema,
});

export const accountPolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  policyId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const accountPolicyListResponseSchema = z.array(
  accountPolicyBaseResponseSchema
);

export type AccountPolicyCreate = z.infer<typeof accountPolicyCreateSchema>;
export type AccountPolicyRemove = z.infer<typeof accountPolicyRemoveSchema>;
export type AccountPolicyBaseResponse = z.infer<
  typeof accountPolicyBaseResponseSchema
>;
export type AccountPolicyListResponse = z.infer<
  typeof accountPolicyListResponseSchema
>;
