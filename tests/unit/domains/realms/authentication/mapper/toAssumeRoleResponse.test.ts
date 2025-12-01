import { describe, expect, it } from 'vitest';
import * as mapper from '@/domains/realms/authentication/authentication.mapper';

describe('authentication.mapper.toAssumeRoleResponse', () => {
  it('should map to AssumeRoleResponse successfully', () => {
    const token = 'test-token-123';
    const expiresIn = 3600;

    const result = mapper.toAssumeRoleResponse(token, expiresIn);

    expect(result).toEqual({
      token: 'test-token-123',
      expiresIn: 3600,
    });
  });
});
