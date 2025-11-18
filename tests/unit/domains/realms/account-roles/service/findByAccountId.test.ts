import { describe, expect, it } from 'vitest';
import * as accountRoleService from '@/domains/realms/account-roles/account-role.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account-role.service.findByAccountId', () => {
  it('should find roles for account successfully', async () => {
    const tenantId = await getTenantId(
      'test-account-role-service-findByAccountId'
    );
    const accountId = uuidv4();
    const roleId1 = uuidv4();
    const roleId2 = uuidv4();

    // Create relationships
    await accountRoleService.create(tenantId, { accountId, roleId: roleId1 });
    await accountRoleService.create(tenantId, { accountId, roleId: roleId2 });

    const accountRoles = await accountRoleService.findByAccountId(
      tenantId,
      accountId
    );

    expect(accountRoles).toHaveLength(2);
    expect(accountRoles[0].accountId).toBe(accountId);
    expect(accountRoles[1].accountId).toBe(accountId);

    const roleIds = accountRoles.map((ar) => ar.roleId);
    expect(roleIds).toContain(roleId1);
    expect(roleIds).toContain(roleId2);
  });

  it('should return empty array for account with no roles', async () => {
    const tenantId = await getTenantId(
      'test-account-role-service-findByAccountId-empty'
    );
    const accountId = uuidv4();

    const accountRoles = await accountRoleService.findByAccountId(
      tenantId,
      accountId
    );

    expect(accountRoles).toHaveLength(0);
  });
});
