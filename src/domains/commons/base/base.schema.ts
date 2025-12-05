import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

// Validation functions to avoid circular imports
const validateXSS = (input: string): boolean => {
  const dangerousChars = /<|>|"|'|&|javascript:|data:|vbscript:|on\w+=/i;
  return !dangerousChars.test(input);
};

const validateSSRF = (email: string): boolean => {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  const isPrivateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(
    domain
  );
  return !blockedDomains.includes(domain) && !isPrivateIP;
};

/**
 * DocIdSchema - Document ID (UUID v4)
 *
 * ALWAYS import and reuse this schema for document IDs (_id fields).
 *
 * Features:
 * - UUID v4 format validation
 * - Used for MongoDB document _id fields
 * - Custom error message for invalid IDs
 *
 * Usage:
 * ```typescript
 * import { DocIdSchema, DocId } from '@/domains/commons/base/base.schema';
 *
 * const mySchema = z.object({
 *   id: DocIdSchema,
 * });
 *
 * // Type usage
 * const findById = async (id: DocId) => { ... }
 * ```
 *
 * DO NOT recreate UUID validation - always import this schema.
 */
export const DocIdSchema = z
  .uuidv4('Invalid ID')
  .openapi({ description: 'Unique identifier (UUID v4)' });
export type DocId = z.infer<typeof DocIdSchema>;

/**
 * PublicUUIDSchema - Public UUID (UUID v4)
 *
 * ALWAYS import and reuse this schema for public identifiers (tenantId, etc).
 *
 * Features:
 * - UUID v4 format validation
 * - Used for tenant IDs and other public identifiers
 * - Custom error message for invalid UUIDs
 *
 * Usage:
 * ```typescript
 * import { publicUUIDSchema, PublicUUID } from '@/domains/commons/base/base.schema';
 *
 * const mySchema = z.object({
 *   tenantId: publicUUIDSchema,
 * });
 *
 * // Type usage
 * const create = async (tenantId: PublicUUID, data: EntityCreate) => { ... }
 * ```
 *
 * DO NOT recreate UUID validation - always import this schema.
 */
export const publicUUIDSchema = z
  .uuidv4('Invalid UUID')
  .openapi({ description: 'public identifier (UUID v4)' });
export type PublicUUID = z.infer<typeof publicUUIDSchema>;

/**
 * Email Schema - RFC 5322 Compliant
 *
 * ALWAYS import and reuse this schema instead of creating new email validations.
 *
 * Features:
 * - RFC 5322 email format validation (official email standard)
 * - XSS protection (blocks dangerous characters like <, >, ", ', &, javascript:, etc)
 * - SSRF protection (blocks localhost, private IPs, internal domains)
 * - Custom error messages for empty/invalid inputs
 *
 * Usage:
 * ```typescript
 * import { emailSchema } from '@/domains/commons/base/base.schema';
 *
 * const mySchema = z.object({
 *   email: emailSchema,
 * });
 * ```
 *
 * DO NOT recreate email validation - always import this schema.
 */
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

/**
 * Password Schema - OWASP Compliant
 *
 * ALWAYS import and reuse this schema instead of creating new password validations.
 *
 * OWASP Requirements:
 * - Minimum 8 characters length
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&*, etc)
 *
 * Usage:
 * ```typescript
 * import { passwordSchema } from '@/domains/commons/base/base.schema';
 *
 * const mySchema = z.object({
 *   password: passwordSchema,
 * });
 * ```
 *
 * DO NOT recreate password validation - always import this schema.
 */
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

// Common field schemas for reuse across domains
export const nameSchema = z
  .string({ error: 'Name is required' })
  .regex(/^[a-zA-Z0-9\s_-]+$/, 'Name contains invalid characters')
  .max(100, 'Name must be at most 100 characters')
  .openapi({
    description: 'Entity name (alphanumeric, spaces, underscore, hyphen)',
  });

export const descriptionSchema = z
  .string()
  .regex(/^[a-zA-Z0-9\s.,!?_-]*$/, 'Description contains invalid characters')
  .max(500, 'Description must be at most 500 characters')
  .openapi({
    description: 'Entity description (alphanumeric, spaces, basic punctuation)',
  });

export const dbNameSchema = z
  .string({ error: 'Database name is required' })
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Database name can only contain letters, numbers, underscores and hyphens'
  )
  .max(50, 'Database name must be at most 50 characters')
  .openapi({ description: 'Database name (alphanumeric, underscore, hyphen)' });

export type Name = z.infer<typeof nameSchema>;
export type Description = z.infer<typeof descriptionSchema>;
export type DbName = z.infer<typeof dbNameSchema>;

export const ERROR_TYPE = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export const errorTypeEnum = z.enum([
  ERROR_TYPE.VALIDATION_FAILED,
  ERROR_TYPE.NOT_FOUND,
  ERROR_TYPE.UNAUTHORIZED,
  ERROR_TYPE.CONFLICT,
  ERROR_TYPE.INTERNAL_ERROR,
]);

export const errorResponseSchema = z.object({
  error: z.string(),
  error_type: errorTypeEnum.default(ERROR_TYPE.INTERNAL_ERROR),
  details: z.string().optional(),
});

export type ErrorType = z.infer<typeof errorTypeEnum>;

export const validationErrorResponseSchema = errorResponseSchema
  .omit({ error_type: true })
  .extend({
    error_type: errorTypeEnum.default(ERROR_TYPE.VALIDATION_FAILED),
    fields: z
      .array(
        z.object({
          field: z.string(),
          message: z.string(),
        })
      )
      .optional(),
  });

export const conflictErrorResponseSchema = errorResponseSchema
  .omit({ error_type: true })
  .extend({
    error_type: errorTypeEnum.default(ERROR_TYPE.CONFLICT),
    field: z.string().optional(),
  });

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ValidationErrorResponse = z.infer<
  typeof validationErrorResponseSchema
>;
export type ConflictErrorResponse = z.infer<typeof conflictErrorResponseSchema>;
