import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

describe('GET /api/config/app/:appName/env/:env', () => {
  const getApp = () => globalThis.testKoaApp;
  let originalLoggerLevel: string | undefined;

  beforeAll(() => {
    originalLoggerLevel = process.env.LOGGER_LEVEL;
    process.env.LOGGER_LEVEL = 'debug';
  });

  afterAll(() => {
    process.env.LOGGER_LEVEL = originalLoggerLevel;
  });

  it('should return config for web-admin app', async () => {
    // First initialize the config
    await request(getApp().callback())
      .get('/api/config/init-setup')
      .expect(200);

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
