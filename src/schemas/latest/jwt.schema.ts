import z from 'zod';

export const jwtPayloadSchema = z.object({
  userId: z.string({ error: 'User ID is required' }),
  email: z.email('Invalid email format'),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
