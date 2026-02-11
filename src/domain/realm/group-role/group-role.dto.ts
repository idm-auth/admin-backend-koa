import {
  DocIdSchema,
  DtoTypes,
} from '@idm-auth/koa-inversify-framework/common';
import { z } from 'zod';

export const groupRoleCreateSchema = z.object({
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;
export type GroupRoleResponse = z.infer<typeof groupRoleBaseResponseSchema>;

export interface GroupRoleDtoTypes extends DtoTypes {
  CreateRequestDto: GroupRoleCreate;
  CreateResponseDto: GroupRoleResponse;
  FindByIdResponseDto: GroupRoleResponse;
  FindOneResponseDto: GroupRoleResponse;
  FindAllResponseDto: GroupRoleResponse[];
  UpdateRequestDto: GroupRoleResponse;
  UpdateResponseDto: GroupRoleResponse;
  DeleteResponseDto: GroupRoleResponse;
  PaginatedItemDto: GroupRoleResponse;
}
