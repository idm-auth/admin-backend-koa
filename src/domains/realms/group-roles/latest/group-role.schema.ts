import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

export const groupRoleCreateSchema = z.object({
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleResponseSchema = z.object({
  id: DocIdSchema,
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleParamsSchema = z.object({
  groupId: DocIdSchema,
});

export const roleGroupParamsSchema = z.object({
  roleId: DocIdSchema,
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;
