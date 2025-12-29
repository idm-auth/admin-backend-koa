import { describe, it, expect } from 'vitest';
import { withSpan } from '@/utils/tracing.util';

describe('withSpan', () => {
  it('should execute function successfully', () => {
    const result = withSpan(
      { name: 'test.operation', attributes: { operation: 'test' } },
      () => 'success'
    );

    expect(result).toBe('success');
  });

  it('should handle errors and rethrow', () => {
    expect(() =>
      withSpan({ name: 'test.operation' }, () => {
        throw new Error('Test error');
      })
    ).toThrow('Test error');
  });
});
