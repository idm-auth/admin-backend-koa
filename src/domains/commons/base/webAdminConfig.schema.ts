import { z } from 'zod';

export const envConfigZSchema = z.enum([
  'development',
  'production',
  'staging',
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
