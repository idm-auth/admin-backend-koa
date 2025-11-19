import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const accountRoleCreateSchema = z.object({
  accountId: DocIdSchema,
  roleId: DocIdSchema,
});

export const accountRoleRemoveSchema = z.object({
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

export const accountRoleListResponseSchema = z.array(accountRoleBaseResponseSchema);

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;
export type AccountRoleRemove = z.infer<typeof accountRoleRemoveSchema>;
export type AccountRoleBaseResponse = z.infer<typeof accountRoleBaseResponseSchema>;
export type AccountRoleListResponse = z.infer<
  typeof accountRoleListResponseSchema
>;
