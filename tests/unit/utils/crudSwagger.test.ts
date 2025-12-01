import { describe, it, expect } from 'vitest';
import { createCrudSwagger } from '@/utils/crudSwagger.util';
import { z } from 'zod';

describe('crudSwagger.util', () => {
  const mockSchema = z.object({ id: z.string() });

  it('should create CRUD swagger with listPaginated response', () => {
    const paginatedSchema = z.object({ data: z.array(mockSchema), total: z.number() });

    const result = createCrudSwagger(
      'Test',
      mockSchema,
      mockSchema,
      mockSchema,
      mockSchema,
      mockSchema,
      paginatedSchema,
      mockSchema
    );

    expect(result.listPaginated.responses[200].content['application/json'].schema).toBe(paginatedSchema);
    expect(result).toHaveProperty('create');
    expect(result).toHaveProperty('read');
    expect(result).toHaveProperty('update');
    expect(result).toHaveProperty('delete');
    expect(result).toHaveProperty('search');
  });
});
