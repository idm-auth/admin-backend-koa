import { describe, expect, it } from 'vitest';
import * as realmService from '@/domains/core/realms/v1/realm.service';

describe('realm.service validateDBName', () => {
  it('should throw error for malicious database names', async () => {
    const maliciousNames = [
      'https://evil.com',
      'ftp://evil.com',
      'file://etc/passwd',
      'ldap://evil.com',
      'mongodb://evil.com',
      '../../../etc/passwd',
      'db//name',
      'user@domain',
      'db:name',
    ];

    for (const name of maliciousNames) {
      await expect(
        realmService.create({ name: 'test', dbName: name, description: 'test' })
      ).rejects.toThrow('Invalid database name format');
    }
  });

  it('should handle update with malicious dbName', async () => {
    await expect(
      realmService.update('507f1f77bcf86cd799439011', { dbName: 'https://evil.com' })
    ).rejects.toThrow('Invalid database name format');
  });
});