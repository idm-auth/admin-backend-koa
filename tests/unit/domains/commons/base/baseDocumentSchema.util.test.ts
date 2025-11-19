import { describe, expect, it, vi, beforeEach } from 'vitest';
// Import middleware BEFORE mongoose loads schema
import { updatedAtMiddleware } from '@/domains/commons/base/baseDocumentSchema.util';

describe('updatedAtMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  it('should handle null update', () => {
    const context = { getUpdate: () => null };
    const spy = vi.spyOn(context, 'getUpdate');
    const next = vi.fn();

    updatedAtMiddleware.call(context, next);

    expect(spy).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle array update', () => {
    const context = { getUpdate: () => [] };
    const spy = vi.spyOn(context, 'getUpdate');
    const next = vi.fn();

    updatedAtMiddleware.call(context, next);

    expect(spy).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle string update', () => {
    const context = { getUpdate: () => 'string' };
    const spy = vi.spyOn(context, 'getUpdate');
    const next = vi.fn();

    updatedAtMiddleware.call(context, next);

    expect(spy).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle valid object update', () => {
    const updateObj = { name: 'test' };
    const context = { getUpdate: () => updateObj };
    const spy = vi.spyOn(context, 'getUpdate');
    const next = vi.fn();

    updatedAtMiddleware.call(context, next);

    expect(spy).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
    expect(updateObj).toHaveProperty('updatedAt');
  });
});
