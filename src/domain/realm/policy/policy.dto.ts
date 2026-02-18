import {
  DocIdSchema,
  DtoTypes,
} from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';
import { POLICY_EFFECTS } from '@/domain/realm/policy/policy.entity';

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
  name: z.string().min(1),
  description: z.string().optional(),
  effect: z.enum(POLICY_EFFECTS),
});

export const policyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  version: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  effect: z.enum(POLICY_EFFECTS),
});

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
});

export type PolicyCreate = z.infer<typeof policyCreateSchema>;
export type PolicyUpdate = z.infer<typeof policyUpdateSchema>;
export type PolicyResponse = z.infer<typeof policyBaseResponseSchema>;

export interface PolicyDtoTypes extends DtoTypes {
  CreateRequestDto: PolicyCreate;
  CreateResponseDto: PolicyResponse;
  FindByIdResponseDto: PolicyResponse;
  FindOneResponseDto: PolicyResponse;
  FindAllResponseDto: PolicyResponse[];
  UpdateRequestDto: PolicyUpdate;
  UpdateResponseDto: PolicyResponse;
  DeleteResponseDto: PolicyResponse;
  PaginatedItemDto: PolicyResponse;
}
