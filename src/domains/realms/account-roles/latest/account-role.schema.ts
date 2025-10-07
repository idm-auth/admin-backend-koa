import z from 'zod';
import { DocIdSchema } from '@/schemas/latest/base.schema';

export const accountRoleCreateSchema = z.object({
  accountId: z.string({ error: 'Account ID is required' }),
  roleId: z.string({ error: 'Role ID is required' }),
});

export const accountRoleResponseSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  roleId: z.string(),
});

export const accountRoleParamsSchema = z.object({
  accountId: DocIdSchema,
});

export const roleAccountParamsSchema = z.object({
  roleId: DocIdSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;