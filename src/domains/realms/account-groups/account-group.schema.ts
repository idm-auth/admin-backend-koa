import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { DocIdSchema } from '@/domains/commons/base/base.schema';

extendZodWithOpenApi(z);

export const accountGroupCreateSchema = z.object({
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(z.string()).optional(),
});

// Response schemas
export const accountGroupBaseResponseSchema = z.object({
  _id: DocIdSchema,
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
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
  accountId: DocIdSchema,
  groupId: DocIdSchema,
});

export const updateAccountGroupRolesSchema = z.object({
  accountId: DocIdSchema,
  groupId: DocIdSchema,
  roles: z.array(z.string()),
});

export type AccountGroupCreate = z.infer<typeof accountGroupCreateSchema>;
export type AccountGroupBaseResponse = z.infer<typeof accountGroupBaseResponseSchema>;
export type AccountParams = z.infer<typeof accountParamsSchema>;
export type GroupParams = z.infer<typeof groupParamsSchema>;
export type RemoveAccountFromGroup = z.infer<
  typeof removeAccountFromGroupSchema
>;
export type UpdateAccountGroupRoles = z.infer<
  typeof updateAccountGroupRolesSchema
>;
