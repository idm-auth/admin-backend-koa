import { describe, expect, it, vi } from 'vitest';
import { validateZod } from '@/domains/commons/validations/validation.service';
import { z } from 'zod';

describe('validation.service validateZod', () => {
  it('should re-throw non-ZodError errors', async () => {
    const mockSchema = {
      parseAsync: vi.fn().mockRejectedValue(new Error('Database error'))
    } as unknown as z.ZodSchema<string>;

    await expect(validateZod('test', mockSchema)).rejects.toThrow('Database error');
  });
});