import { DocIdSchema, DtoTypes } from 'koa-inversify-framework/common';
import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const accountEmailSchema = z.object({
  email: emailSchema,
  isPrimary: z.boolean(),
});

export const accountBaseResponseSchema = z.object({
  _id: DocIdSchema,
  emails: z.array(accountEmailSchema),
  isActive: z.boolean(),
});

export const accountCreateResponseSchema = accountBaseResponseSchema;

export const accountUpdateSchema = z.object({
  isActive: z.boolean().optional(),
});

export const accountUpdateResponseSchema = accountBaseResponseSchema;

export const accountListItemResponseSchema = accountBaseResponseSchema;

export const accountReadResponseSchema = accountBaseResponseSchema;

export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountCreateResponse = z.infer<typeof accountCreateResponseSchema>;
export type AccountUpdate = z.infer<typeof accountUpdateSchema>;
export type AccountUpdateResponse = z.infer<typeof accountUpdateResponseSchema>;
export type AccountListItemResponse = z.infer<
  typeof accountListItemResponseSchema
>;
export type AccountReadResponse = z.infer<typeof accountReadResponseSchema>;

export interface AccountDtoTypes extends DtoTypes {
  CreateRequestDto: AccountCreate;
  CreateResponseDto: AccountCreateResponse;
  FindByIdResponseDto: AccountReadResponse;
  FindOneResponseDto: AccountReadResponse;
  FindAllResponseDto: AccountListItemResponse[];
  UpdateRequestDto: AccountUpdate;
  UpdateResponseDto: AccountUpdateResponse;
  DeleteResponseDto: AccountReadResponse;
  PaginatedItemDto: AccountListItemResponse;
}
