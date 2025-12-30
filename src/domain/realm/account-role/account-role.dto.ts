import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const accountRoleCreateSchema = z.object({
  accountId: DocIdSchema,
  roleId: DocIdSchema,
});

export const accountRoleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  roleId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;
export type AccountRoleResponse = z.infer<typeof accountRoleBaseResponseSchema>;

export interface AccountRoleDtoTypes extends DtoTypes {
  CreateRequestDto: AccountRoleCreate;
  CreateResponseDto: AccountRoleResponse;
  FindByIdResponseDto: AccountRoleResponse;
  FindOneResponseDto: AccountRoleResponse;
  FindAllResponseDto: AccountRoleResponse[];
  UpdateRequestDto: AccountRoleResponse;
  UpdateResponseDto: AccountRoleResponse;
  DeleteResponseDto: AccountRoleResponse;
  PaginatedItemDto: AccountRoleResponse;
}
