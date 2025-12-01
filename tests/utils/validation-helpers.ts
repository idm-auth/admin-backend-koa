import request from 'supertest';
import { expect } from 'vitest';

export const expectValidationError = async (
  endpoint: string,
  data: unknown,
  expectedError: string | RegExp,
  authToken?: string
) => {
  const req = request(globalThis.testKoaApp.callback()).post(endpoint);

  if (authToken) {
    req.set('Authorization', `Bearer ${authToken}`);
  }

  const response = await req.send(data as Record<string, unknown>).expect(400);

  if (typeof expectedError === 'string') {
    expect(response.body).toHaveProperty('error', expectedError);
  } else {
    expect(response.body.error).toMatch(expectedError);
  }
};
