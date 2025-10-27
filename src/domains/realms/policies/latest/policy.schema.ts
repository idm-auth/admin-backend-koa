import { z } from 'zod';
import {
  DocIdSchema,
  requestIDParamsSchema,
} from '@/domains/commons/base/latest/base.schema';

export const policyCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny'], { error: 'Effect must be Allow or Deny' }),
  actions: z.array(z.string()).min(1, 'At least one action is required'),
  resources: z.array(z.string()).min(1, 'At least one resource is required'),
  conditions: z.record(z.string(), z.string()).optional(),
});

// Response schemas
export const policyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.record(z.string(), z.any()).optional(),
});

export const policyCreateResponseSchema = policyBaseResponseSchema;
export const policyUpdateResponseSchema = policyBaseResponseSchema;
export const policyReadResponseSchema = policyBaseResponseSchema;
export const policyListResponseSchema = z.array(policyBaseResponseSchema);
export const policySearchResponseSchema = policyReadResponseSchema;

export const policyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']).optional(),
  actions: z.array(z.string()).optional(),
  resources: z.array(z.string()).optional(),
  conditions: z.record(z.string(), z.string()).optional(),
});

export type PolicyCreate = z.infer<typeof policyCreateSchema>;
export type PolicyBaseResponse = z.infer<typeof policyBaseResponseSchema>;
export type PolicyCreateResponse = z.infer<typeof policyCreateResponseSchema>;
export type PolicyUpdateResponse = z.infer<typeof policyUpdateResponseSchema>;
export type PolicyReadResponse = z.infer<typeof policyReadResponseSchema>;
export type PolicyListResponse = z.infer<typeof policyListResponseSchema>;
export type PolicySearchResponse = z.infer<typeof policySearchResponseSchema>;
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>;

export type PolicyParams = z.infer<typeof requestIDParamsSchema>;
