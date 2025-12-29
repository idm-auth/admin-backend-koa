import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const rolePolicyCreateSchema = z.object({
  roleId: DocIdSchema,
  policyId: DocIdSchema,
});

export const rolePolicyBaseResponseSchema = z.object({
  _id: DocIdSchema,
  roleId: DocIdSchema,
  policyId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RolePolicyCreate = z.infer<typeof rolePolicyCreateSchema>;
export type RolePolicyResponse = z.infer<typeof rolePolicyBaseResponseSchema>;

export interface RolePolicyDtoTypes extends DtoTypes {
  CreateRequestDto: RolePolicyCreate;
  CreateResponseDto: RolePolicyResponse;
  FindByIdResponseDto: RolePolicyResponse;
  FindOneResponseDto: RolePolicyResponse;
  FindAllResponseDto: RolePolicyResponse[];
  UpdateRequestDto: never;
  UpdateResponseDto: never;
  DeleteResponseDto: RolePolicyResponse;
  PaginatedItemDto: RolePolicyResponse;
}
