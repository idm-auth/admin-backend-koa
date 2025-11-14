import { z } from 'zod';
import {
  DocIdSchema,
  requestIDParamsSchema,
} from '@/domains/commons/base/base.schema';

export const groupCreateSchema = z.object({
  name: z.string({ error: 'Name is required' }),
  description: z.string().optional(),
});

// Response schemas
export const groupBaseResponseSchema = z.object({
  _id: DocIdSchema,
  name: z.string(),
  description: z.string().optional(),
});

export const groupCreateResponseSchema = groupBaseResponseSchema;
export const groupUpdateResponseSchema = groupBaseResponseSchema;
export const groupReadResponseSchema = groupBaseResponseSchema;
export const groupListResponseSchema = z.array(groupBaseResponseSchema);
export const groupSearchResponseSchema = groupReadResponseSchema;

export const groupUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type GroupCreate = z.infer<typeof groupCreateSchema>;
export type GroupBaseResponse = z.infer<typeof groupBaseResponseSchema>;
export type GroupCreateResponse = z.infer<typeof groupCreateResponseSchema>;
export type GroupUpdateResponse = z.infer<typeof groupUpdateResponseSchema>;
export type GroupReadResponse = z.infer<typeof groupReadResponseSchema>;
export type GroupListResponse = z.infer<typeof groupListResponseSchema>;
export type GroupSearchResponse = z.infer<typeof groupSearchResponseSchema>;
export type GroupUpdate = z.infer<typeof groupUpdateSchema>;

export type GroupParams = z.infer<typeof requestIDParamsSchema>;
