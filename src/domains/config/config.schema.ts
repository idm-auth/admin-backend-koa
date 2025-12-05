import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { envConfigZSchema } from '@/domains/commons/base/webAdminConfig.schema';
import { emailSchema, passwordSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const configParamsSchema = z.object({
  appName: z.string(),
  env: envConfigZSchema,
});

export type ConfigParams = z.infer<typeof configParamsSchema>;

export const initSetupSchema = z.object({
  adminAccount: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export type InitSetup = z.infer<typeof initSetupSchema>;
