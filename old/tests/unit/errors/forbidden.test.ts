import { describe, expect, it } from 'vitest';
import { ForbiddenError } from '@/errors/forbidden';

describe('ForbiddenError', () => {
  it('should create error with default message', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe('Forbidden');
    expect(error.name).toBe('ForbiddenError');
    expect(error.statusCode).toBe(403);
  });

  it('should create error with custom message', () => {
    const error = new ForbiddenError('Access denied');

    expect(error.message).toBe('Access denied');
    expect(error.name).toBe('ForbiddenError');
    expect(error.statusCode).toBe(403);
  });
});
