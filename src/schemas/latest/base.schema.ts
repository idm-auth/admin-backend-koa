import z from 'zod';

export const DocIdSchema = z.uuidv4('Invalid ID');
export type DocId = z.infer<typeof DocIdSchema>;

export const publicUUIDSchema = z.uuidv4('Invalid ID');
export type PublicUUID = z.infer<typeof publicUUIDSchema>;

export const emailSchema = z.email({
  pattern: z.regexes.rfc5322Email,
  error: (issue) =>
    issue.input === undefined || issue.input === ''
      ? 'Email is required'
      : 'Invalid email format',
});

export type Email = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .string({ error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^a-zA-Z0-9]/,
    'Password must contain at least one special character'
  );

export type Password = z.infer<typeof passwordSchema>;
