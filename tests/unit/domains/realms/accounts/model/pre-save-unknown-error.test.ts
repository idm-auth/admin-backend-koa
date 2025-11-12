import { describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { getModel } from '@/domains/realms/accounts/account.model';
import { getTenantId } from '@test/utils/tenant.util';
import { getDBName } from '@/domains/core/realms/realm.service';

describe('account.model pre-save unknown error', () => {
  it('should handle unknown error during password hashing', async () => {
    const tenantId = await getTenantId('test-pre-save-unknown-error');
    const dbName = await getDBName(tenantId);
    const AccountModel = getModel(dbName);

    // Mock bcrypt.genSalt para lançar um erro não-Error
    const originalGenSalt = bcrypt.genSalt;
    vi.spyOn(bcrypt, 'genSalt').mockImplementation(() => {
      throw 'String error'; // Não é uma instância de Error
    });

    const account = new AccountModel({
      emails: [{ email: 'test@example.com', isPrimary: true }],
      password: 'Password123!',
    });

    await expect(account.save()).rejects.toThrow('Unknown error during password hashing');

    // Restaurar mock
    bcrypt.genSalt = originalGenSalt;
  });
});