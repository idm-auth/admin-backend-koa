import { z } from 'zod';

export const loginResponseZSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.email(),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseZSchema>;
