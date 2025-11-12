import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { envConfigZSchema } from '@/domains/commons/base/webAdminConfig.schema';

extendZodWithOpenApi(z);

export const configParamsSchema = z.object({
  appName: z.string(),
  env: envConfigZSchema,
});

export type ConfigParams = z.infer<typeof configParamsSchema>;