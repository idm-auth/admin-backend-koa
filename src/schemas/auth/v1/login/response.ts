import { z } from 'zod';

export const loginResponseZSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    emails: z.array(z.object({
      email: z.string().email(),
      isPrimary: z.boolean()
    })),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseZSchema>;
