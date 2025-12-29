import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/pagination.schema';
import { POLICY_EFFECTS } from './policy.model';

extendZodWithOpenApi(z);

export const policyCreateSchema = z.object({
  version: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Version must be ISO date format (YYYY-MM-DD)'
    )
    .refine(
      (v) => {
        const date = new Date(v);
        return (
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          v === date.toISOString().split('T')[0]
        );
      },
      { message: 'Version must be valid ISO date (YYYY-MM-DD)' }
    )
    .optional()
    .default('2025-12-24'),
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
  effect: z.enum(POLICY_EFFECTS, { error: 'Effect must be Allow or Deny' }),
  actions: z.array(z.string()).min(1, 'At least one action is required'),
  resources: z.array(z.string()).min(1, 'At least one resource is required'),
});

export const policyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  version: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  effect: z.enum(POLICY_EFFECTS),
  actions: z.array(z.string()),
  resources: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const policyCreateResponseSchema = policyBaseResponseSchema;
export const policyUpdateResponseSchema = policyBaseResponseSchema;
export const policyReadResponseSchema = policyBaseResponseSchema;
export const policyListItemResponseSchema = policyBaseResponseSchema;

export const policyUpdateSchema = z.object({
  version: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Version must be ISO date format (YYYY-MM-DD)'
    )
    .refine(
      (v) => {
        const date = new Date(v);
        return (
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          v === date.toISOString().split('T')[0]
        );
      },
      { message: 'Version must be valid ISO date (YYYY-MM-DD)' }
    )
    .optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  effect: z.enum(POLICY_EFFECTS).optional(),
  actions: z.array(z.string()).min(1).optional(),
  resources: z.array(z.string()).min(1).optional(),
});

export type PolicyCreate = z.infer<typeof policyCreateSchema>;
export type PolicyBaseResponse = z.infer<typeof policyBaseResponseSchema>;
export type PolicyCreateResponse = z.infer<typeof policyCreateResponseSchema>;
export type PolicyUpdateResponse = z.infer<typeof policyUpdateResponseSchema>;
export type PolicyReadResponse = z.infer<typeof policyReadResponseSchema>;
export type PolicyListItemResponse = z.infer<
  typeof policyListItemResponseSchema
>;
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>;

export const policyListQuerySchema = paginationQuerySchema;
export const policyPaginatedResponseSchema = createPaginatedResponseSchema(
  policyListItemResponseSchema
);

export type PolicyListQuery = z.infer<typeof policyListQuerySchema>;
export type PolicyPaginatedResponse = z.infer<
  typeof policyPaginatedResponseSchema
>;
