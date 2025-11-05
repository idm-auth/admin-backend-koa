import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';
import * as accountService from '@/domains/realms/accounts/v1/account.service';

describe('DELETE /api/realm/:tenantId/v1/accounts/:id/email', () => {
  let tenantId: string;
  let accountId: string;
  let primaryEmail: string;
  let secondaryEmail: string;

  const getApp = () => globalThis.testKoaApp;

  beforeAll(async () => {
    tenantId = await getTenantId('test-tenant-remove-email');
  });

  beforeEach(async () => {
    const uniqueId = uuidv4().substring(0, 8);
    primaryEmail = `primary-${uniqueId}@example.com`;
    secondaryEmail = `secondary-${uniqueId}@example.com`;

    // Criar conta com email primário
    const account = await accountService.create(tenantId, {
      email: primaryEmail,
      password: 'Password123!',
    });
    accountId = account._id;

    // Adicionar email secundário
    await accountService.addEmail(tenantId, accountId, secondaryEmail);
  });

  it('should remove email successfully', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .set('Content-Type', 'application/json')
      .send({ email: secondaryEmail });

    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
    console.log('TenantId:', tenantId);
    console.log('AccountId:', accountId);
    console.log('SecondaryEmail:', secondaryEmail);

    expect(response.status).toBe(200);
  });

  it('should return 400 for missing email', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Email is required');
  });

  it('should return 400 for removing the only email', async () => {
    // Remover email secundário primeiro para deixar apenas o principal
    await accountService.removeEmail(tenantId, accountId, secondaryEmail);

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send({ email: primaryEmail })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Cannot remove the only email from account');
  });

  it('should return 404 for email not found in account', async () => {
    const nonExistentEmail = `nonexistent-${uuidv4().substring(0, 8)}@example.com`;

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send({ email: nonExistentEmail })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Email not found in this account');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${accountId}/email`)
      .send({ email: 'invalid-email' })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid email format');
  });

  it('should return 404 for non-existent account', async () => {
    const nonExistentId = uuidv4();

    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/${nonExistentId}/email`)
      .send({ email: secondaryEmail })
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Account not found');
  });

  it('should return 400 for invalid account ID format', async () => {
    const response = await request(getApp().callback())
      .delete(`/api/realm/${tenantId}/v1/accounts/invalid-uuid/email`)
      .send({ email: secondaryEmail })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Invalid ID');
  });
});