import { DocIdSchema } from '@/domains/commons/base/base.schema';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const jwtPayloadSchema = z.object({
  accountId: DocIdSchema,

  // Cross-realm fields (when assuming role)
  sourceRealmId: DocIdSchema.optional(),
  targetRealmId: DocIdSchema.optional(),
  assumedRoleId: DocIdSchema.optional(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const jwtPayloadSignSchema = jwtPayloadSchema.extend({
  iat: z.number(),
});

export type JwtPayloadSign = z.infer<typeof jwtPayloadSignSchema>;
