import { emailSchema, passwordSchema } from '@/schemas/v1/base.schema';
import z from 'zod';

export const userCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type UserCreate = z.infer<typeof userCreateSchema>;
