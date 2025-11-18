import { describe, expect, it } from 'vitest';
import * as realmsRoutes from '@/domains/realms/realms.routes';

describe('realms.routes', () => {
  it('should initialize router successfully', async () => {
    const router = await realmsRoutes.initialize();

    expect(router).toBeDefined();
    expect(typeof router.useMagic).toBe('function');
  });
});
