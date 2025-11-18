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

export const accountRoleResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  roleId: DocIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const accountRoleListResponseSchema = z.array(accountRoleResponseSchema);

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;
export type AccountRoleRemove = z.infer<typeof accountRoleRemoveSchema>;
export type AccountRoleResponse = z.infer<typeof accountRoleResponseSchema>;
export type AccountRoleListResponse = z.infer<
  typeof accountRoleListResponseSchema
>;
