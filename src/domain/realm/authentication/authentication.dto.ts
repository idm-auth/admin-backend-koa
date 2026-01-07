import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  account: z.object({
    _id: z.string(),
    emails: z.array(
      z.object({
        email: z.string().email(),
        isPrimary: z.boolean(),
      })
    ),
  }),
});

export const validateTokenRequestSchema = z.object({
  token: z.string().min(1),
});

export const validateTokenResponseSchema = z.object({
  valid: z.boolean(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type ValidateTokenRequest = z.infer<typeof validateTokenRequestSchema>;
export type ValidateTokenResponse = z.infer<typeof validateTokenResponseSchema>;
