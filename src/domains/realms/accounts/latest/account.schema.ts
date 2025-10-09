import {
  emailSchema,
  passwordSchema,
} from '@/domains/commons/base/v1/base.schema';
import { z } from 'zod';

export const accountCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AccountCreate = z.infer<typeof accountCreateSchema>;
