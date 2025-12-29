import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const accountPolicyCreateSchema = z.object({
  accountId: DocIdSchema,
  policyId: DocIdSchema,
});

export const accountPolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  policyId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AccountPolicyCreate = z.infer<typeof accountPolicyCreateSchema>;
export type AccountPolicyResponse = z.infer<typeof accountPolicyBaseResponseSchema>;

export interface AccountPolicyDtoTypes extends DtoTypes {
  CreateRequestDto: AccountPolicyCreate;
  CreateResponseDto: AccountPolicyResponse;
  FindByIdResponseDto: AccountPolicyResponse;
  FindOneResponseDto: AccountPolicyResponse;
  FindAllResponseDto: AccountPolicyResponse[];
  UpdateRequestDto: never;
  UpdateResponseDto: never;
  DeleteResponseDto: AccountPolicyResponse;
  PaginatedItemDto: AccountPolicyResponse;
}
