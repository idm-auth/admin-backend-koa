import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

export const groupCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const groupBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional().nullish(),
});

export const groupUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type GroupCreate = z.infer<typeof groupCreateSchema>;
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;
export type GroupResponse = z.infer<typeof groupBaseResponseSchema>;

export interface GroupDtoTypes extends DtoTypes {
  CreateRequestDto: GroupCreate;
  CreateResponseDto: GroupResponse;
  FindByIdResponseDto: GroupResponse;
  FindOneResponseDto: GroupResponse;
  FindAllResponseDto: GroupResponse[];
  UpdateRequestDto: GroupUpdate;
  UpdateResponseDto: GroupResponse;
  DeleteResponseDto: GroupResponse;
  PaginatedItemDto: GroupResponse;
}
