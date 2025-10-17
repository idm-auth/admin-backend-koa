import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

export const policyCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny'], { error: 'Effect must be Allow or Deny' }),
  actions: z.array(z.string()).min(1, 'At least one action is required'),
  resources: z.array(z.string()).min(1, 'At least one resource is required'),
  conditions: z.record(z.string(), z.string()).optional(),
});

// Response schemas
export const policyResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  conditions: z.record(z.string(), z.any()).optional(),
});

export const policyUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny']).optional(),
  actions: z.array(z.string()).optional(),
  resources: z.array(z.string()).optional(),
  conditions: z.record(z.string(), z.string()).optional(),
});



// Params schemas
export const policyParamsSchema = z.object({
  id: DocIdSchema,
});

export type PolicyCreate = z.infer<typeof policyCreateSchema>;
export type PolicyResponse = z.infer<typeof policyResponseSchema>;
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>;

export type PolicyParams = z.infer<typeof policyParamsSchema>;
