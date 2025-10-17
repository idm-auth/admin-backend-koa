import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

export const groupCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
});

// Response schemas
export const groupResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
});

export const groupUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});



// Params schemas
export const groupParamsSchema = z.object({
  id: DocIdSchema,
});

export type GroupCreate = z.infer<typeof groupCreateSchema>;
export type GroupResponse = z.infer<typeof groupResponseSchema>;
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;

export type GroupParams = z.infer<typeof groupParamsSchema>;
