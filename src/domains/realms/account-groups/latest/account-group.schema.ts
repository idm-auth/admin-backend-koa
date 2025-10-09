import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

export const accountGroupCreateSchema = z.object({
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(DocIdSchema).optional(),
});

export type AccountGroupCreate = z.infer<typeof accountGroupCreateSchema>;
