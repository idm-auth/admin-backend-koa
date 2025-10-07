import z from 'zod';

export const accountGroupCreateSchema = z.object({
  accountId: z.string({ error: 'Account ID is required' }),
  groupId: z.string({ error: 'Group ID is required' }),
  roles: z.array(z.string()).optional(),
});

export type AccountGroupCreate = z.infer<typeof accountGroupCreateSchema>;