import z from 'zod';

export const policyCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  effect: z.enum(['Allow', 'Deny'], { error: 'Effect must be Allow or Deny' }),
  actions: z.array(z.string()).min(1, 'At least one action is required'),
  resources: z.array(z.string()).min(1, 'At least one resource is required'),
  conditions: z.record(z.string(), z.string()).optional(),
});

export type PolicyCreate = z.infer<typeof policyCreateSchema>;