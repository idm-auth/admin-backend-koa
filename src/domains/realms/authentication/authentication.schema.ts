import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { emailSchema, DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const loginResponseSchema = z.object({
  token: z.string(),
  account: z.object({
    _id: DocIdSchema,
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

export const assumeRoleRequestSchema = z.object({
  targetRealmId: DocIdSchema,
  assumedRoleId: DocIdSchema,
});

export const assumeRoleResponseSchema = z.object({
  token: z.string(),
  expiresIn: z.number(),
});

export type AssumeRoleRequest = z.infer<typeof assumeRoleRequestSchema>;
export type AssumeRoleResponse = z.infer<typeof assumeRoleResponseSchema>;
