import request from 'supertest';
import { TEST_PASSWORD, createTestEmail } from './test-constants';
import * as accountService from '@/domains/realms/accounts/account.service';

/**
 * Helper to get JWT token for tests
 * Creates an account and logs in to get the token
 */
export const getAuthToken = async (
  tenantId: string,
  emailPrefix: string
): Promise<string> => {
  await accountService.create(tenantId, {
    email: createTestEmail(emailPrefix),
    password: TEST_PASSWORD,
  });

  const loginResponse = await request(globalThis.testKoaApp.callback())
    .post(`/api/realm/${tenantId}/authentication/login`)
    .send({
      email: createTestEmail(emailPrefix),
      password: TEST_PASSWORD,
    })
    .expect(200);

  return loginResponse.body.token;
};
