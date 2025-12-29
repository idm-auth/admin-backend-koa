import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const envConfigZSchema = z.enum([
  'development',
  'production',
  'staging',
  'test',
]);

export type EnvConfig = z.infer<typeof envConfigZSchema>;

export const webAdminConfigZSchema = z.object({
  env: envConfigZSchema,
  app: z.string(),
  api: z.object({
    main: z.object({
      url: z.string(),
    }),
  }),
  coreRealm: z.object({
    publicUUID: z.uuidv4(),
  }),
});

export type WebAdminConfigResponse = z.infer<typeof webAdminConfigZSchema>;
