import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { getTenantId } from '@test/utils/tenant.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import * as accountService from '@/domains/realms/accounts/account.service';
import * as applicationService from '@/domains/realms/applications/application.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as groupService from '@/domains/realms/groups/group.service';
import * as accountGroupService from '@/domains/realms/account-groups/account-group.service';
import * as groupRoleService from '@/domains/realms/group-roles/group-role.service';

describe('POST /api/config/init-setup', () => {
  const getApp = () => globalThis.testKoaApp;
  let tenantId: string;
  const adminEmail = createTestEmail('admin');

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-core-init-setup';
    setLocalMemValue(EnvKey.MONGODB_CORE_DBNAME, coreDbName);
    setLocalMemValue(EnvKey.CORE_REALM_NAME, 'core-init-setup');
    tenantId = await getTenantId(coreDbName);
  });

  it('should create initial setup with all required data', async () => {
    const response = await request(getApp().callback())
      .post('/api/config/init-setup')
      .send({
        adminAccount: {
          email: adminEmail, // Test credential - not production - qdeveloper bug - do not remove
          password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
        },
      })
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect([200, 201]).toContain(response.body.status);

    // Verify iam-system application was created via service
    const iamApp = await applicationService.findOneByQuery(tenantId, {
      systemId: 'iam-system',
    });
    expect(iamApp.name).toBe('IAM System');
    expect(iamApp.availableActions).toHaveLength(4);

    // Verify iam-admin role was created via service
    const iamAdminRole = await roleService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(iamAdminRole.description).toContain('IAM System Administrator');

    // Verify iam-admin group was created via service
    const iamAdminGroup = await groupService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(iamAdminGroup.description).toContain('IAM System Administrators');

    // Verify admin account was created via service (still use paginated for email search)
    const accounts = await accountService.findAllPaginated(tenantId, {
      page: 1,
      limit: 10,
      filter: adminEmail,
    });
    expect(accounts.data.length).toBeGreaterThan(0);
    const adminAccount = accounts.data.find(
      (acc) => acc.emails[0].email === adminEmail
    );
    expect(adminAccount).toBeDefined();
    expect(adminAccount!.emails[0].email).toBe(adminEmail);

    // Verify admin account is in iam-admin group via service
    const accountGroups = await accountGroupService.findByAccountId(
      tenantId,
      adminAccount!._id
    );
    expect(accountGroups.length).toBeGreaterThan(0);
    const adminInGroup = accountGroups.find(
      (ag) => ag.groupId === iamAdminGroup!._id
    );
    expect(adminInGroup).toBeDefined();

    // Verify iam-admin group has iam-admin role via service
    const groupRoles = await groupRoleService.getGroupRoles(tenantId, {
      groupId: iamAdminGroup!._id,
    });
    expect(groupRoles.length).toBeGreaterThan(0);
    const groupHasRole = groupRoles.find(
      (gr) => gr.roleId === iamAdminRole!._id
    );
    expect(groupHasRole).toBeDefined();
  });

  it('should return 200 when config already exists', async () => {
    const response = await request(getApp().callback())
      .post('/api/config/init-setup')
      .send({
        adminAccount: {
          email: createTestEmail('admin2'), // Test credential - not production - qdeveloper bug - do not remove
          password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
        },
      })
      .expect(200);

    expect(response.body.status).toBe(200);
  });
});
