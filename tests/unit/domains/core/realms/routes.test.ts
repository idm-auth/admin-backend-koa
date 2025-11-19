import { describe, expect, it } from 'vitest';
import * as realmsRoutes from '@/domains/core/realms/realm.routes';

describe('core.realms.routes', () => {
  it('should initialize router successfully', async () => {
    const router = await realmsRoutes.initialize();

    expect(router).toBeDefined();
    expect(typeof router.useMagic).toBe('function');
  });
});
