import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DocIdSchema } from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const policyResourceCreateSchema = z.object({
  policyId: DocIdSchema,
  partition: z.string().min(1),
  system: z.string().min(1),
  region: z.string(),
  tenantId: z.string().min(1),
  resourcePath: z.string().min(1),
});

export const policyResourceBaseResponseSchema =
  policyResourceCreateSchema.extend({
    _id: DocIdSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  });

export type PolicyResourceDtoTypes = {
  CreateRequestDto: z.infer<typeof policyResourceCreateSchema>;
  BaseResponseDto: z.infer<typeof policyResourceBaseResponseSchema>;
};
