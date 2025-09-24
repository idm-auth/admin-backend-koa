import { ValidationError } from '@/errors/validation';
import { getModel } from '@/models/db/realms/users/users.v1.model';
import { getDBName } from '@/services/latest/realm.service';
import { z } from 'zod';
import { userCreateSchema } from '@/schemas/latest/user.schema';

export const validateEmail = (email: string): void => {
  if (!email) {
    throw new ValidationError('Email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

export const validatePassword = (password: string): void => {
  if (!password) {
    throw new ValidationError('Password is required');
  }
};

export const validateEmailUnique = async (
  tenantId: string,
  email: string
): Promise<void> => {
  const dbName = await getDBName({ publicUUID: tenantId });
  const existingUser = await getModel(dbName).findOne({
    'emails.email': email,
  });

  if (existingUser) {
    throw new ValidationError('Email already exists');
  }
};

export const validateZod = <T>(data: unknown, schema: z.ZodSchema<T>): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => e.message).join(', ');
      throw new ValidationError(message);
    }
    throw error;
  }
};

export const validateUserCreate = async (
  tenantId: string,
  args: { email: string; password: string }
): Promise<void> => {
  // Validação com Zod
  validateZod(args, userCreateSchema);

  // Validação de unicidade no banco
  await validateEmailUnique(tenantId, args.email);
};
