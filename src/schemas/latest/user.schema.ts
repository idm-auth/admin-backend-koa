import z from 'zod';

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
