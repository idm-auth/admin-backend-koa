import { z } from 'zod';

export const loginRequestZSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginRequestZSchema>;
