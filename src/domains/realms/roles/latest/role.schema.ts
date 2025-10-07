import z from 'zod';

export const roleCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type RoleCreate = z.infer<typeof roleCreateSchema>;