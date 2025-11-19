import { describe, expect, it } from 'vitest';
import request from 'supertest';

describe('GET /api/config/init-setup', () => {
  const getApp = () => globalThis.testKoaApp;

  it('should return init setup status', async () => {
    const response = await request(getApp().callback())
      .get('/api/config/init-setup')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect([200, 201]).toContain(response.body.status);
  });
});
