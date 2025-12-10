import { describe, expect, it } from 'vitest';
import { realmCreateSchema } from '@/domains/core/realms/realm.schema';

describe('realm.schema expiresIn validation', () => {
  it('should throw error for invalid expiresIn format', () => {
    const invalidData = {
      name: 'test-realm',
      dbName: 'test-db',
      jwtConfig: {
        expiresIn: 'invalid-format',
      },
    };

    expect(() => realmCreateSchema.parse(invalidData)).toThrow(
      'Invalid time format'
    );
  });
});
