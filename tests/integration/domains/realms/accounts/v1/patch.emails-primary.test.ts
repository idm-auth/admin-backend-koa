import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('PATCH /api/realm/:tenantId/v1/accounts/:id/email/primary', () => {
  let tenantId: string;
  let accountId: string;

  const getApp = () => globalThis.testKoaApp;
  const TEST_PASSWORD = 'Password123!';

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-primary-email');

    // Criar uma conta para testar definir email principal
    const accountData = {
      email: 'primaryemailtest@example.com',
      password: TEST_PASSWORD,
    };

    const response = await request(getApp().callback())
      .post(`/api/realm/${tenantId}/v1/accounts`)
      .send(accountData);

    if (response.status === 201) {
      accountId = response.body._id;

      // Adicionar emails secundários
      await request(getApp().callback())
        .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
        .send({ email: 'secondary1@example.com' });

      await request(getApp().callback())
        .post(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
        .send({ email: 'secondary2@example.com' });
    }
  });

  it('should set primary email successfully', async () => {
    const emailData = {
      email: 'secondary1@example.com',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email', 'secondary1@example.com');
    expect(response.body).toHaveProperty('isPrimary', true);
    expect(response.body).not.toHaveProperty('password');
  });

  it('should return 400 for missing email', async () => {
    const emailData = {};

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email is required');
  });

  it('should return 404 for email not found in account', async () => {
    const emailData = {
      email: 'nonexistent@example.com',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Email not found in this account');
  });

  it('should return 400 for invalid email format', async () => {
    const emailData = {
      email: 'invalid-email',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should set already primary email as primary (idempotent)', async () => {
    const emailData = {
      email: 'secondary1@example.com', // Já é primary do teste anterior
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email', 'secondary1@example.com');
    expect(response.body).toHaveProperty('isPrimary', true);
  });

  it('should change primary email from one to another', async () => {
    const emailData = {
      email: 'secondary2@example.com',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${accountId}/email/primary`)
      .send(emailData)
      .expect(200);

    expect(response.body).toHaveProperty('_id', accountId);
    expect(response.body).toHaveProperty('email', 'secondary2@example.com');
    expect(response.body).toHaveProperty('isPrimary', true);
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();
    const emailData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}/email/primary`)
      .send(emailData)
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const invalidId = 'invalid-uuid';
    const emailData = {
      email: 'test@example.com',
    };

    const response = await request(getApp().callback())
      .patch(`/api/realm/${tenantId}/v1/accounts/${invalidId}/email/primary`)
      .send(emailData)
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});