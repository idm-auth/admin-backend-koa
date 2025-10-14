import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';

extendZodWithOpenApi(z);

export const accountGroupCreateSchema = z.object({
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(DocIdSchema).optional(),
});

// Response schemas
export const accountGroupResponseSchema = z.object({
  id: DocIdSchema,
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(DocIdSchema).optional(),
});

// Params schemas
export const accountParamsSchema = z.object({
  accountId: DocIdSchema,
});

export const groupParamsSchema = z.object({
  groupId: DocIdSchema,
});

// Body schemas for operations
export const removeAccountFromGroupSchema = z.object({
  accountId: z.string(),
  groupId: z.string(),
});

export const updateAccountGroupRolesSchema = z.object({
  accountId: z.string(),
  groupId: z.string(),
  roles: z.array(z.string()),
});

export type AccountGroupCreate = z.infer<typeof accountGroupCreateSchema>;
export type AccountGroupResponse = z.infer<typeof accountGroupResponseSchema>;
export type AccountParams = z.infer<typeof accountParamsSchema>;
export type GroupParams = z.infer<typeof groupParamsSchema>;
export type RemoveAccountFromGroup = z.infer<typeof removeAccountFromGroupSchema>;
export type UpdateAccountGroupRoles = z.infer<typeof updateAccountGroupRolesSchema>;
