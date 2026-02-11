import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { DocIdSchema } from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const policyActionCreateSchema = z.object({
  policyId: DocIdSchema,
  system: z.string().min(1),
  resource: z.string().min(1),
  operation: z.string().min(1),
});

export const policyActionBaseResponseSchema = policyActionCreateSchema.extend({
  _id: DocIdSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PolicyActionDtoTypes = {
  CreateRequestDto: z.infer<typeof policyActionCreateSchema>;
  BaseResponseDto: z.infer<typeof policyActionBaseResponseSchema>;
};
