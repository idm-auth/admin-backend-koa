import z from 'zod';
import { DocIdSchema } from '@/schemas/latest/base.schema';

export const groupRoleCreateSchema = z.object({
  groupId: z.string({ error: 'Group ID is required' }),
  roleId: z.string({ error: 'Role ID is required' }),
});

export const groupRoleResponseSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  roleId: z.string(),
});

export const groupRoleParamsSchema = z.object({
  groupId: DocIdSchema,
});

export const roleGroupParamsSchema = z.object({
  roleId: DocIdSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;