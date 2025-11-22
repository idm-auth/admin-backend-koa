import { findByEmail } from '@/domains/realms/accounts/account.service';
import { NotFoundError } from '@/errors/not-found';
import { ValidationError } from '@/errors/validation';
import { z } from 'zod';

export const validateEmailUnique = async (
  tenantId: string,
  email: string
): Promise<void> => {
  try {
    await findByEmail(tenantId, email);
    throw new ValidationError('Email already exists');
  } catch (error) {
    if (error instanceof NotFoundError) {
      return;
    }
    throw error;
  }
};

export const validateZod = async <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => e.message).join(', ');
      throw new ValidationError(message);
    }
    throw error;
  }
};
