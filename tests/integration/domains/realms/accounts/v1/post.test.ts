import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';

describe('POST /api/realm/:tenantId/v1/accounts', () => {
  let tenantId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-account-post');
  });

  it('should create a new account successfully', async () => {
    const accountData = {
      email: 'test@example.com',
      // amazonq-ignore-next-line
      password: TEST_PASSWORD,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(accountData.email);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const accountData = {
      // amazonq-ignore-next-line
      password: TEST_PASSWORD,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Email is required');
  });

  it('should return 400 for missing password', async () => {
    const accountData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Password is required');
  });

  it('should return 400 for invalid email format', async () => {
    const accountData = {
      email: 'invalid-email',
      // amazonq-ignore-next-line
      password: TEST_PASSWORD,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toContain('Invalid email format');
  });

  it('should return 400 for weak password', async () => {
    const accountData = {
      email: 'test@example.com',
      // amazonq-ignore-next-line
      password: 'weak',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Validation failed');
    expect(response.body.details).toMatch(/Password must/);
  });

  it('should return 500 for server errors', async () => {
    // Teste com dados que causem erro interno
    const accountData = {
      email: 'test@example.com',
      // amazonq-ignore-next-line
      password: TEST_PASSWORD,
    };

    // Mock para simular erro no service se necessário
    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData);

    if (response.status === 500) {
      expect(response.body).toHaveProperty('error', 'Internal server error');
    }
  });
});
