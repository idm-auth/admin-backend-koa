import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const roleCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export const roleBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().nullable().optional(),
  permissions: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const roleUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

export type RoleCreate = z.infer<typeof roleCreateSchema>;
export type RoleUpdate = z.infer<typeof roleUpdateSchema>;
export type RoleResponse = z.infer<typeof roleBaseResponseSchema>;

export interface RoleDtoTypes extends DtoTypes {
  CreateRequestDto: RoleCreate;
  CreateResponseDto: RoleResponse;
  FindByIdResponseDto: RoleResponse;
  FindOneResponseDto: RoleResponse;
  FindAllResponseDto: RoleResponse[];
  UpdateRequestDto: RoleUpdate;
  UpdateResponseDto: RoleResponse;
  DeleteResponseDto: RoleResponse;
  PaginatedItemDto: RoleResponse;
}
