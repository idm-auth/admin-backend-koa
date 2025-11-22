import { generateTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { beforeAll, describe, expect, it } from 'vitest';
import { getTenantId } from '@test/utils/tenant.util';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as groupService from '@/domains/realms/groups/group.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as accountGroupService from '@/domains/realms/account-groups/account-group.service';
import { getModel } from '@/domains/realms/account-groups/account-group.model';
import { getDBName } from '@/domains/core/realms/realm.service';

describe('AccountGroups Populate Test', () => {
  let tenantId: string;
  let accountId: string;
  let groupId: string;
  let roleId: string;

  beforeAll(async () => {
    tenantId = await getTenantId('vi-test-db-tenant-populate');

    // Criar account, group e role com email único
    const uniqueEmail = generateTestEmail('populate');
    const account = await accountService.create(tenantId, {
      email: uniqueEmail, // Test credential - not production
      password: TEST_PASSWORD, // Test credential - not production
    });
    accountId = account._id.toString();

    const group = await groupService.create(tenantId, {
      name: 'Populate Group',
      description: 'Test group for populate',
    });
    groupId = group._id.toString();

    const role = await roleService.create(tenantId, {
      name: 'Populate Role',
      description: 'Test role for populate',
    });
    roleId = role._id.toString();

    // Criar relação account-group com role
    await accountGroupService.create(tenantId, {
      accountId,
      groupId,
      roles: [roleId],
    });
  });

  it('should do manual populate with UUIDs', async () => {
    const dbName = await getDBName({ publicUUID: tenantId });

    // 1. Buscar AccountGroups
    const accountGroups = await getModel(dbName).find({ accountId });
    expect(accountGroups).toHaveLength(1);

    const accountGroup = accountGroups[0];

    // 2. Populate manual - buscar documentos relacionados
    const account = await accountService.findById(
      tenantId,
      accountGroup.accountId
    );
    const group = await groupService.findById(tenantId, accountGroup.groupId);
    const roles = await Promise.all(
      accountGroup.roles.map((roleId) => roleService.findById(tenantId, roleId))
    );

    // 3. Verificar dados populados manualmente
    expect(account.emails[0].email).toContain('@idm-auth.io'); // Test credential - not production
    expect(group.name).toBe('Populate Group');
    expect(roles).toHaveLength(1);
    expect(roles[0].name).toBe('Populate Role');
  });

  it('should work without populate (return UUIDs)', async () => {
    const dbName = await getDBName({ publicUUID: tenantId });

    // Sem populate - deve retornar UUIDs
    const accountGroups = await getModel(dbName).find({ accountId });

    expect(accountGroups).toHaveLength(1);

    const accountGroup = accountGroups[0];

    // Verificar que são strings (UUIDs)
    expect(accountGroup.accountId).toBeTypeOf('string');
    expect(accountGroup.groupId).toBeTypeOf('string');
    expect(accountGroup.roles[0]).toBeTypeOf('string');

    // Verificar valores
    expect(accountGroup.accountId).toBe(accountId);
    expect(accountGroup.groupId).toBe(groupId);
    expect(accountGroup.roles[0]).toBe(roleId);
  });
});
