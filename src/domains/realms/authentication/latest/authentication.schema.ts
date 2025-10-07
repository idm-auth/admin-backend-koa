import { z } from 'zod';
import { emailSchema } from '@/schemas/latest/base.schema';

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  account: z.object({
    id: z.string(),
    emails: z.array(
      z.object({
        email: emailSchema,
        isPrimary: z.boolean(),
      })
    ),
  }),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;