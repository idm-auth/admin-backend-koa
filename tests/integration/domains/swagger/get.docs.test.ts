import { describe, expect, it } from 'vitest';
import request from 'supertest';

describe('GET /api-docs endpoints', () => {
  const getApp = () => globalThis.testKoaApp;

  it('should return swagger JSON', async () => {
    const response = await request(getApp().callback())
      .get('/api-docs/swagger.json')
      .expect(200);

    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
  });

  it('should return swagger UI HTML', async () => {
    const response = await request(getApp().callback())
      .get('/api-docs-ui')
      .expect(200);

    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('API Documentation');
  });

  it('should return swagger initializer JS', async () => {
    const response = await request(getApp().callback())
      .get('/api-docs/swagger-initializer.js')
      .expect(200);

    expect(response.headers['content-type']).toContain('application/javascript');
    expect(response.text).toContain('/api-docs/swagger.json');
  });
});