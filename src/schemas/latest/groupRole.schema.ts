import z from 'zod';

export const groupRoleCreateSchema = z.object({
  groupId: z.string({ error: 'Group ID is required' }),
  roleId: z.string({ error: 'Role ID is required' }),
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;