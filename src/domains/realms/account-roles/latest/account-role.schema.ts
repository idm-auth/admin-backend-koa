import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

export const accountRoleCreateSchema = z.object({
  accountId: DocIdSchema,
  roleId: DocIdSchema,
});

export const accountRoleResponseSchema = z.object({
  id: DocIdSchema,
  accountId: DocIdSchema,
  roleId: DocIdSchema,
});

export const accountRoleParamsSchema = z.object({
  accountId: DocIdSchema,
});

export const roleAccountParamsSchema = z.object({
  roleId: DocIdSchema,
});

export type AccountRoleCreate = z.infer<typeof accountRoleCreateSchema>;