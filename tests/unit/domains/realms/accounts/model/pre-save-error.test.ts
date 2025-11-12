import { describe, expect, it } from 'vitest';
import { schema } from '@/domains/realms/accounts/account.model';

describe('account.model schema validation', () => {
  it('should have required fields defined', () => {
    const paths = schema.paths;
    expect(paths).toHaveProperty('emails');
    expect(paths).toHaveProperty('password');
    expect(paths).toHaveProperty('salt');
  });

  it('should have correct email schema structure', () => {
    const emailsPath = schema.paths.emails as any;
    expect(emailsPath.schema.paths).toHaveProperty('email');
    expect(emailsPath.schema.paths).toHaveProperty('isPrimary');
  });
});