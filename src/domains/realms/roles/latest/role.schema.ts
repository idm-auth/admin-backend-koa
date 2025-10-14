import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

export const roleCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// Response schemas
export const roleResponseSchema = z.object({
  id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const roleUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

// Query schemas
export const roleSearchQuerySchema = z.object({
  name: z.string(),
});

// Params schemas
export const roleParamsSchema = z.object({
  id: DocIdSchema,
});

export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleResponse = z.infer<typeof roleResponseSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;
export type RoleSearchQuery = z.infer<typeof roleSearchQuerySchema>;
export type RoleParams = z.infer<typeof roleParamsSchema>;
