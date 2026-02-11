import {
  DocIdSchema,
  DtoTypes,
} from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

export const groupPolicyCreateSchema = z.object({
  groupId: DocIdSchema,
  policyId: DocIdSchema,
});

export const groupPolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  groupId: DocIdSchema,
  policyId: DocIdSchema,
});

export type GroupPolicyCreate = z.infer<typeof groupPolicyCreateSchema>;
export type GroupPolicyResponse = z.infer<typeof groupPolicyBaseResponseSchema>;

export interface GroupPolicyDtoTypes extends DtoTypes {
  CreateRequestDto: GroupPolicyCreate;
  CreateResponseDto: GroupPolicyResponse;
  FindByIdResponseDto: GroupPolicyResponse;
  FindOneResponseDto: GroupPolicyResponse;
  FindAllResponseDto: GroupPolicyResponse[];
  UpdateRequestDto: GroupPolicyResponse;
  UpdateResponseDto: GroupPolicyResponse;
  DeleteResponseDto: GroupPolicyResponse;
  PaginatedItemDto: GroupPolicyResponse;
}
