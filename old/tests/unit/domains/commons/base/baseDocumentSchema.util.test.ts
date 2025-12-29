import { beforeEach, describe, expect, it, vi } from 'vitest';
// Import middleware BEFORE mongoose loads schema
import { updatedAtMiddleware } from '@/domains/commons/base/baseDocumentSchema.util';

describe('updatedAtMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  it('should handle null update', async () => {
    const context = { getUpdate: () => null };
    const spy = vi.spyOn(context, 'getUpdate');

    await updatedAtMiddleware.call(context);

    expect(spy).toHaveBeenCalled();
  });

  it('should handle array update', async () => {
    const context = { getUpdate: () => [] };
    const spy = vi.spyOn(context, 'getUpdate');

    await updatedAtMiddleware.call(context);

    expect(spy).toHaveBeenCalled();
  });

  it('should handle string update', async () => {
    const context = { getUpdate: () => 'string' };
    const spy = vi.spyOn(context, 'getUpdate');

    await updatedAtMiddleware.call(context);

    expect(spy).toHaveBeenCalled();
  });

  it('should handle valid object update', async () => {
    const updateObj = { name: 'test' };
    const context = { getUpdate: () => updateObj };
    const spy = vi.spyOn(context, 'getUpdate');

    await updatedAtMiddleware.call(context);

    expect(spy).toHaveBeenCalled();
    expect(updateObj).toHaveProperty('updatedAt');
  });
});
