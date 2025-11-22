import { describe, expect, it } from 'vitest';
import * as accountRoleService from '@/domains/realms/account-roles/account-role.service';
import { getTenantId } from '@test/utils/tenant.util';
import { v4 as uuidv4 } from 'uuid';

describe('account-role.service.create', () => {
  it('should create account-role relationship successfully', async () => {
    const tenantId = await getTenantId(
      'vi-test-db-account-role-service-create'
    );
    const relationshipData = {
      accountId: uuidv4(),
      roleId: uuidv4(),
    };

    const accountRole = await accountRoleService.create(
      tenantId,
      relationshipData
    );

    expect(accountRole).toHaveProperty('_id');
    expect(accountRole.accountId).toBe(relationshipData.accountId);
    expect(accountRole.roleId).toBe(relationshipData.roleId);
    expect(accountRole).toHaveProperty('createdAt');
    expect(accountRole).toHaveProperty('updatedAt');
  });
});
