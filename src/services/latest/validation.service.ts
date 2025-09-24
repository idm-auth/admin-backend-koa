import { ValidationError } from '@/errors/validation';
import { NotFoundError } from '@/errors/not-found';
import { z } from 'zod';
import { findByEmail } from '@/services/v1/user.service';

export const validateEmailUnique = async (
  tenantId: string,
  email: string
): Promise<void> => {
  try {
    const existingUser = await findByEmail(tenantId, { email });
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      // Email não existe, é válido para criação
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
    return schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => e.message).join(', ');
      throw new ValidationError(message);
    }
    throw error;
  }
};
