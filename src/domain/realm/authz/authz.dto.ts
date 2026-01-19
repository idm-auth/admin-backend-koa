import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { grnSchema } from 'koa-inversify-framework/common';
import { policyActionSchema } from 'koa-inversify-framework/common';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const evaluateRequestSchema = z.object({
  userToken: z.string().min(1),
  grn: grnSchema,
  action: policyActionSchema,
});

export const evaluateResponseSchema = z.object({
  allowed: z.boolean(),
  error: z.string().optional(),
});

export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;
export type EvaluateResponse = z.infer<typeof evaluateResponseSchema>;
