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
});

export type AccountPolicyCreate = z.infer<typeof accountPolicyCreateSchema>;
export type AccountPolicyResponse = z.infer<
  typeof accountPolicyBaseResponseSchema
>;

export interface AccountPolicyDtoTypes extends DtoTypes {
  CreateRequestDto: AccountPolicyCreate;
  CreateResponseDto: AccountPolicyResponse;
  FindByIdResponseDto: AccountPolicyResponse;
  FindOneResponseDto: AccountPolicyResponse;
  FindAllResponseDto: AccountPolicyResponse[];
  UpdateRequestDto: AccountPolicyResponse;
  UpdateResponseDto: AccountPolicyResponse;
  DeleteResponseDto: AccountPolicyResponse;
  PaginatedItemDto: AccountPolicyResponse;
}
