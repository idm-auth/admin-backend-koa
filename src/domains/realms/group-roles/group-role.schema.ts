import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const groupRoleCreateSchema = z.object({
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleResponseSchema = z.object({
  _id: DocIdSchema,
  groupId: DocIdSchema,
  roleId: DocIdSchema,
});

export const groupRoleParamsSchema = z.object({
  tenantId: DocIdSchema,
  groupId: DocIdSchema,
});

export const roleGroupParamsSchema = z.object({
  tenantId: DocIdSchema,
  roleId: DocIdSchema,
});

export type GroupRoleCreate = z.infer<typeof groupRoleCreateSchema>;
export type GroupRoleResponse = z.infer<typeof groupRoleResponseSchema>;
