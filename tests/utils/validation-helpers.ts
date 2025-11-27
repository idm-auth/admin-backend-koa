import request from 'supertest';
import { expect } from 'vitest';

export const expectValidationError = async (
  endpoint: string,
  data: unknown,
  expectedError: string | RegExp
) => {
  const response = await request(globalThis.testKoaApp.callback())
    .post(endpoint)
    .send(data)
    .expect(400);

  if (typeof expectedError === 'string') {
    expect(response.body).toHaveProperty('error', expectedError);
  } else {
    expect(response.body.error).toMatch(expectedError);
  }
};
