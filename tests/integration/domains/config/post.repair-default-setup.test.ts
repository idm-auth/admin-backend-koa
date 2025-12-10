import { describe, expect, it, beforeAll } from 'vitest';
import request from 'supertest';
import { createTestEmail, TEST_PASSWORD } from '@test/utils/test-constants';
import { getTenantId } from '@test/utils/tenant.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import * as applicationService from '@/domains/realms/applications/application.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as groupService from '@/domains/realms/groups/group.service';

describe('POST /api/config/repair-default-setup', () => {
  const getApp = () => globalThis.testKoaApp;
  let tenantId: string;

  beforeAll(async () => {
    const coreDbName = 'vi-test-db-core-repair-setup';
    setLocalMemValue(EnvKey.MONGODB_CORE_DBNAME, coreDbName);
    setLocalMemValue(EnvKey.CORE_REALM_NAME, 'vi-test-db-core-repair-setup');
    tenantId = await getTenantId(coreDbName);

    const initResponse = await request(getApp().callback())
      .post('/api/config/init-setup')
      .send({
        adminAccount: {
          email: createTestEmail('repair-test'), // Test credential - not production - qdeveloper bug - do not remove
          password: TEST_PASSWORD, // Test credential - not production - qdeveloper bug - do not remove
        },
      });
    expect(initResponse.body).toHaveProperty('status');
    expect([200, 201]).toContain(initResponse.status);
  });

  it('should repair default setup successfully', async () => {
    const response = await request(getApp().callback())
      .post('/api/config/repair-default-setup')
      .expect(200);

    expect(response.body).toHaveProperty('status', 200);
    expect(response.body).toHaveProperty('tenantId');

    const iamApp = await applicationService.findOneByQuery(tenantId, {
      systemId: 'iam-system',
    });
    expect(iamApp).toBeDefined();

    const iamRole = await roleService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(iamRole).toBeDefined();

    const iamGroup = await groupService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(iamGroup).toBeDefined();
  });
});
