import request from 'supertest';
import { TEST_PASSWORD, createTestEmail } from './test-constants';

/**
 * Helper to get JWT token for tests
 * Creates an account and logs in to get the token
 */
export const getAuthToken = async (
  tenantId: string,
  emailPrefix: string
): Promise<string> => {
  const loginResponse = await request(globalThis.testKoaApp.callback())
    .post(`/api/realm/${tenantId}/authentication/login`)
    .send({
      email: createTestEmail(emailPrefix), // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    })
    .expect(200);

  return loginResponse.body.token;
};
