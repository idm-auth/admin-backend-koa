import { ValidationError } from '@/errors/validation';
import { NotFoundError } from '@/errors/not-found';
import { z } from 'zod';
import { findByEmail } from '@/domains/realms/accounts/v1/account.service';

export const validateXSS = (input: string): boolean => {
  const dangerousChars = /<|>|"|'|&|javascript:|data:|vbscript:|on\w+=/i;
  return !dangerousChars.test(input);
};

export const validateSSRF = (email: string): boolean => {
  const domain = email.split('@')[1];
  const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
  const isPrivateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(
    domain
  );
  return !blockedDomains.includes(domain) && !isPrivateIP;
};

export const validateEmailUnique = async (
  tenantId: string,
  email: string
): Promise<void> => {
  try {
    const existingAccount = await findByEmail(tenantId, email);
    if (existingAccount) {
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
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => e.message).join(', ');
      throw new ValidationError(message);
    }
    throw error;
  }
};
