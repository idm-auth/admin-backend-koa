import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const evaluateRequestSchema = z.object({
  accountId: z.string().min(1),
  action: z.string().min(1),
  resource: z.string().min(1),
  partition: z.string().optional(),
  region: z.string().optional(),
});

export const evaluateResponseSchema = z.object({
  allowed: z.boolean(),
  error: z.string().optional(),
});

export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;
export type EvaluateResponse = z.infer<typeof evaluateResponseSchema>;
