import { describe, expect, it, beforeAll } from 'vitest';
import { getWebAdminConfig, initSetup } from '@/domains/config/config.service';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';

describe('config.service getWebAdminConfig', () => {
  beforeAll(async () => {
    await initSetup({
      adminAccount: {
        email: createTestEmail('admin'), // Test credential - not production - qdeveloper bug - do not remove
        password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
      },
    });
  });

  it('should get web admin config', async () => {
    const config = await getWebAdminConfig({
      app: 'web-admin',
      env: 'test',
    });

    expect(config).toHaveProperty('app', 'web-admin');
    expect(config).toHaveProperty('env', 'test');
    expect(config).toHaveProperty('api');
    expect(config).toHaveProperty('coreRealm');
  });
});
