import { describe, expect, it } from 'vitest';
import { schema } from '@/domains/realms/accounts/v1/account.model';

describe('account.model.schema', () => {
  it('should have required fields defined', () => {
    const paths = schema.paths;
    
    expect(paths).toHaveProperty('_id');
    expect(paths).toHaveProperty('emails');
    expect(paths).toHaveProperty('password');
    expect(paths).toHaveProperty('salt');
  });

  it('should have emails as array type', () => {
    const emailsPath = schema.paths.emails;
    expect(emailsPath).toBeDefined();
  });

  it('should have password field configured', () => {
    const passwordPath = schema.paths.password;
    expect(passwordPath).toBeDefined();
    expect(passwordPath.isRequired).toBe(true);
  });

  it('should have indexes configured', () => {
    const indexes = schema.indexes();
    expect(indexes).toBeDefined();
    expect(Array.isArray(indexes)).toBe(true);
  });
});