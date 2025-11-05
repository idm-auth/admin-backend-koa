import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('POST /api/realm/:tenantId/v1/accounts/:id/email', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-add-email');

    // Criar uma conta para testar adicionar email usando service
    const account = await accountService.create(tenantId, {
      email: 'addemailtest@example.com',
      password: TEST_PASSWORD,
    });
    accountId = account._id;
  });

  it('should add email successfully', async () => {
    const emailData = {
      email: 'secondary@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send(emailData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('isPrimary');
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const emailData = {};

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email is required');
  });

  it('should return 400 for invalid email format', async () => {
    const emailData = {
      email: 'invalid-email',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should return 400 for duplicate email in same account', async () => {
    const emailData = {
      email: 'secondary@example.com', // Email já adicionado no primeiro teste
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email already exists');
  });

  it('should return 400 for email already used by another account', async () => {
    // Criar outra conta usando service
    const otherAccount = await accountService.create(tenantId, {
      email: 'other@example.com',
      password: TEST_PASSWORD,
    });

    // Tentar adicionar email da primeira conta na segunda
    const emailData = {
      email: 'addemailtest@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${otherAccount._id}/email`)
      .send(emailData)
      .expect(400);

    expect(response.body.error).toMatch(/Email already exists/);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const emailData = {
      email: 'newemail@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}/email`)
      .send(emailData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const emailData = {
      email: 'newemail@example.com',
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts/${invalidId}/email`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});
