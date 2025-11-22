import { describe, it, expect } from 'vitest';
import { withSpanAsync } from '@/utils/tracing.util';

describe('withSpanAsync', () => {
  it('should execute async function successfully', async () => {
    const result = await withSpanAsync(
      { name: 'test.operation', attributes: { operation: 'test' } },
      async () => 'success'
    );

    expect(result).toBe('success');
  });

  it('should handle async errors and rethrow', async () => {
    await expect(
      withSpanAsync({ name: 'test.operation' }, async () => {
        throw new Error('Async test error');
      })
    ).rejects.toThrow('Async test error');
  });
});
