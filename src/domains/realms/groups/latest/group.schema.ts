import z from 'zod';

export const groupCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
});

export type GroupCreate = z.infer<typeof groupCreateSchema>;