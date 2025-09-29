import z from 'zod';

export const accountRoleCreateSchema = z.object({
  accountId: z.string({ error: 'Account ID is required' }),
  roleId: z.string({ error: 'Role ID is required' }),
});

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;