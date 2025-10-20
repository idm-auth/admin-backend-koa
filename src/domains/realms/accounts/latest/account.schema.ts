import {
  emailSchema,
  passwordSchema,
} from '@/domains/commons/base/v1/base.schema';
import { DocIdSchema } from '@/domains/commons/base/latest/base.schema';
import { z } from 'zod';

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Response schemas
export const accountResponseSchema = z.object({
  _id: DocIdSchema,
  email: z.string().email(),
});

export const accountUpdateSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});

export type AccountCreate = z.infer<typeof accountCreateSchema>;
export type AccountResponse = z.infer<typeof accountResponseSchema>;
export type AccountUpdate = z.infer<typeof accountUpdateSchema>;
