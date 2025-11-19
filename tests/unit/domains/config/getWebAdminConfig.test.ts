import { describe, expect, it, beforeAll } from 'vitest';
import { getWebAdminConfig, initSetup } from '@/domains/config/config.service';

describe('config.service getWebAdminConfig', () => {
  beforeAll(async () => {
    await initSetup();
  });

  it('should get web admin config', async () => {
    const config = await getWebAdminConfig({
      app: 'web-admin',
      env: 'test'
    });

    expect(config).toHaveProperty('app', 'web-admin');
    expect(config).toHaveProperty('env', 'test');
    expect(config).toHaveProperty('api');
    expect(config).toHaveProperty('coreRealm');
  });
});