import { describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { schema, getModel } from '@/domains/realms/accounts/account.model';
import { getTenantId } from '@test/utils/tenant.util';
import { getDBName } from '@/domains/core/realms/realm.service';

describe('account.model pre-save hook', () => {
  it('should handle non-Error exceptions in pre-save hook', async () => {
    const tenantId = await getTenantId('test-model-pre-save-error');
    const dbName = await getDBName(tenantId);

    const genSaltSpy = vi.spyOn(bcrypt, 'genSalt');
    genSaltSpy.mockRejectedValue('bcrypt string error');

    try {
      const AccountModel = getModel(dbName);
      const account = new AccountModel({
        emails: [{ email: 'test@example.com', isPrimary: true }],
        password: 'Password123!',
      });

      await expect(account.save()).rejects.toThrow(
        'Unknown error during password hashing'
      );
    } finally {
      genSaltSpy.mockRestore();
    }
  });

  it('should handle Error exceptions in pre-save hook', async () => {
    const tenantId = await getTenantId('test-model-pre-save-error-if');
    const dbName = await getDBName(tenantId);

    const genSaltSpy = vi.spyOn(bcrypt, 'genSalt');
    const originalError = new Error('bcrypt genSalt failed');
    genSaltSpy.mockRejectedValue(originalError);

    try {
      const AccountModel = getModel(dbName);
      const account = new AccountModel({
        emails: [{ email: 'test2@example.com', isPrimary: true }],
        password: 'Password123!',
      });

      await expect(account.save()).rejects.toThrow('bcrypt genSalt failed');
    } finally {
      genSaltSpy.mockRestore();
    }
  });

  it('should handle unknown error during password hashing', async () => {
    const tenantId = await getTenantId('test-pre-save-unknown-error');
    const dbName = await getDBName(tenantId);
    const AccountModel = getModel(dbName);

    const originalGenSalt = bcrypt.genSalt;
    vi.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
      throw 'String error';
    });

    const account = new AccountModel({
      emails: [{ email: 'test@example.com', isPrimary: true }],
      password: 'Password123!',
    });

    await expect(account.save()).rejects.toThrow(
      'Unknown error during password hashing'
    );

    bcrypt.genSalt = originalGenSalt;
  });
});
