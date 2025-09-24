import { ValidationError } from '@/errors/validation';

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

export const validateRequired = (value: unknown, fieldName: string): void => {
  if (!value) {
    throw new ValidationError(`${fieldName} is required`);
  }
};
