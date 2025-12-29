import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const groupRoleCreateSchema = z.object({
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  groupId: DocIdSchema,
  roleId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;
export type GroupRoleResponse = z.infer<typeof groupRoleBaseResponseSchema>;

export interface GroupRoleDtoTypes extends DtoTypes {
  CreateRequestDto: GroupRoleCreate;
  CreateResponseDto: GroupRoleResponse;
  FindByIdResponseDto: GroupRoleResponse;
  FindOneResponseDto: GroupRoleResponse;
  FindAllResponseDto: GroupRoleResponse[];
  UpdateRequestDto: never;
  UpdateResponseDto: never;
  DeleteResponseDto: GroupRoleResponse;
  PaginatedItemDto: GroupRoleResponse;
}
