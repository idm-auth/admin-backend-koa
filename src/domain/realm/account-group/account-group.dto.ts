import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const accountGroupCreateSchema = z.object({
  accountId: DocIdSchema,
  groupId: DocIdSchema,
});

export const accountGroupBaseResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AccountGroupCreate = z.infer<typeof accountGroupCreateSchema>;
export type AccountGroupResponse = z.infer<typeof accountGroupBaseResponseSchema>;

export interface AccountGroupDtoTypes extends DtoTypes {
  CreateRequestDto: AccountGroupCreate;
  CreateResponseDto: AccountGroupResponse;
  FindByIdResponseDto: AccountGroupResponse;
  FindOneResponseDto: AccountGroupResponse;
  FindAllResponseDto: AccountGroupResponse[];
  UpdateRequestDto: never;
  UpdateResponseDto: never;
  DeleteResponseDto: AccountGroupResponse;
  PaginatedItemDto: AccountGroupResponse;
}
