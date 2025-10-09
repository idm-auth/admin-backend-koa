import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  DocIdSchema,
  emailSchema,
} from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

export const jwtPayloadSchema = z.object({
  accountId: DocIdSchema,
  email: emailSchema,
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
