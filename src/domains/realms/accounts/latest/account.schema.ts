import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import {
  emailSchema,
  passwordSchema,
} from '@/domains/commons/base/latest/base.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import {
  paginationQuerySchema,
  createPaginatedResponseSchema,
} from '@/domains/commons/base/latest/pagination.schema';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Response schemas
export const accountBaseResponseSchema = z.strictObject({
  _id: DocIdSchema,
  email: emailSchema,
  isPrimary: z.boolean(),
});

export const accountCreateResponseSchema = accountBaseResponseSchema;

export const accountUpdateResponseSchema = accountBaseResponseSchema;

export const accountListItemResponseSchema = accountBaseResponseSchema;

export const accountReadResponseSchema = accountBaseResponseSchema;

export const accountListResponseSchema = z.array(accountListItemResponseSchema);

export const accountSearchResponseSchema = accountReadResponseSchema;

// Account update schema - Email e password não podem ser alterados aqui
// Email e password devem ter métodos específicos para alteração
export const accountUpdateSchema = z.object({
  // Adicionar outros campos que podem ser atualizados aqui
  // email e password são excluídos intencionalmente
});

export const accountResetPasswordSchema = z.object({
  password: passwordSchema,
});

export const accountUpdatePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const accountAddEmailSchema = z.object({
  email: emailSchema,
});

export const accountRemoveEmailSchema = z.object({
  email: emailSchema,
});

export const accountSetPrimaryEmailSchema = z.object({
  email: emailSchema,
});

export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountBaseResponse = z.infer<typeof accountBaseResponseSchema>;
export type AccountCreateResponse = z.infer<typeof accountCreateResponseSchema>;
export type AccountUpdateResponse = z.infer<typeof accountUpdateResponseSchema>;
export type AccountListItemResponse = z.infer<
  typeof accountListItemResponseSchema
>;
export type AccountReadResponse = z.infer<typeof accountReadResponseSchema>;
export type AccountListResponse = z.infer<typeof accountListResponseSchema>;
export type AccountSearchResponse = z.infer<typeof accountSearchResponseSchema>;
export type AccountUpdate = z.infer<typeof accountUpdateSchema>;
export type AccountResetPassword = z.infer<typeof accountResetPasswordSchema>;
export type AccountUpdatePassword = z.infer<typeof accountUpdatePasswordSchema>;
export type AccountAddEmail = z.infer<typeof accountAddEmailSchema>;
export type AccountRemoveEmail = z.infer<typeof accountRemoveEmailSchema>;
export type AccountSetPrimaryEmail = z.infer<typeof accountSetPrimaryEmailSchema>;

// Pagination schemas
export const accountListQuerySchema = paginationQuerySchema;
export const accountPaginatedResponseSchema = createPaginatedResponseSchema(
  accountListItemResponseSchema
);

export type AccountListQuery = z.infer<typeof accountListQuerySchema>;
export type AccountPaginatedResponse = z.infer<
  typeof accountPaginatedResponseSchema
>;
