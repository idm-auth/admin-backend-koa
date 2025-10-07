import z from 'zod';

export const jwtPayloadSchema = z.object({
  accountId: z.string({ error: 'Account ID is required' }),
  email: z.email('Invalid email format'),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
