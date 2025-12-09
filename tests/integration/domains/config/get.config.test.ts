import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { getTenantId } from '@test/utils/tenant.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';

describe('GET /api/config/app/:appName/env/:env', () => {
  const getApp = () => globalThis.testKoaApp;
  let originalLoggerLevel: string | undefined;

  beforeAll(async () => {
    originalLoggerLevel = process.env.LOGGER_LEVEL;
    process.env.LOGGER_LEVEL = 'debug';

    const coreDbName = 'vi-test-db-core-get-config';
    setLocalMemValue(EnvKey.MONGODB_CORE_DBNAME, coreDbName);
    setLocalMemValue(EnvKey.CORE_REALM_NAME, 'core-get-config');
    await getTenantId(coreDbName);
  });

  afterAll(() => {
    process.env.LOGGER_LEVEL = originalLoggerLevel;
  });

  it('should return config for web-admin app', async () => {
    // First initialize the config (idempotent - returns 200 if exists, 201 if created)
    const initResponse = await request(getApp().callback())
      .post('/api/config/init-setup')
      .send({
        adminAccount: {
          email: createTestEmail('config-test'), // Test credential - not production - qdeveloper bug - do not remove
          password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
        },
      });

    expect([200, 201]).toContain(initResponse.status);

    // Then get the config
    const response = await request(getApp().callback())
      .get('/api/config/app/web-admin/env/test')
      .expect(200);

    expect(response.body).toHaveProperty('env', 'test');
    expect(response.body).toHaveProperty('app', 'web-admin');
    expect(response.body).toHaveProperty('api');
    expect(response.body).toHaveProperty('coreRealm');
  });

  it('should return 404 for nonexistent config', async () => {
    await request(getApp().callback())
      .get('/api/config/app/nonexistent/env/test')
      .expect(404);
  });
});
