import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  validateXSS,
  validateSSRF,
} from '@/domains/commons/validations/latest/validation.service';

extendZodWithOpenApi(z);

export const DocIdSchema = z
  .uuidv4('Invalid ID')
  .openapi({ description: 'Unique identifier (UUID v4)' });
export type DocId = z.infer<typeof DocIdSchema>;

export const publicUUIDSchema = z
  .uuidv4('Invalid ID')
  .openapi({ description: 'Tenant identifier (UUID v4)' });
export type PublicUUID = z.infer<typeof publicUUIDSchema>;

export const emailSchema = z
  .email({
    pattern: z.regexes.rfc5322Email,
    error: (issue) =>
      issue.input === undefined || issue.input === ''
        ? 'Email is required'
        : 'Invalid email format',
  })
  .refine(validateXSS, 'Email contains invalid characters')
  .refine(validateSSRF, 'Email domain not allowed')
  .openapi({ description: 'Valid email address' });

export type Email = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
  .openapi({
    description:
      'Strong password with at least 8 characters, including uppercase, lowercase, number and special character',
    example: 'MySecure123!',
  });

export type Password = z.infer<typeof passwordSchema>;

export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
