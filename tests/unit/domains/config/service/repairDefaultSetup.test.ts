import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import * as configService from '@/domains/config/config.service';
import * as realmService from '@/domains/core/realms/realm.service';
import * as applicationService from '@/domains/realms/applications/application.service';
import * as roleService from '@/domains/realms/roles/role.service';
import * as groupService from '@/domains/realms/groups/group.service';
import * as groupRoleService from '@/domains/realms/group-roles/group-role.service';
import { getModel as getRealmModel } from '@/domains/core/realms/realm.model';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { v4 as uuidv4 } from 'uuid';

describe('config.service.repairDefaultSetup', () => {
  const coreRealmName = `core-repair-${uuidv4()}`;
  const coreDbName = `vi-test-db-core-repair-${uuidv4()}`;
  let tenantId: string;
  let createdRealmId: string;

  beforeAll(async () => {
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreRealmName);

    const createdRealm = await getRealmModel().create({
      name: coreRealmName,
      dbName: coreDbName,
      description: 'Test core realm for repair',
    });
    createdRealmId = createdRealm._id.toString();
    tenantId = createdRealm.publicUUID;
  });

  afterAll(async () => {
    await getRealmModel().findByIdAndDelete(createdRealmId);
  });

  it('should create all default resources when missing', async () => {
    const result = await configService.repairDefaultSetup(tenantId);

    expect(result).toHaveProperty('status', 200);
    expect(result).toHaveProperty('tenantId', tenantId);

    // Verify resources were created
    const app = await applicationService.findOneByQuery(tenantId, {
      systemId: 'iam-system',
    });
    expect(app).toHaveProperty('systemId', 'iam-system');

    const role = await roleService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(role).toHaveProperty('name', 'iam-admin');

    const group = await groupService.findOneByQuery(tenantId, {
      name: 'iam-admin',
    });
    expect(group).toHaveProperty('name', 'iam-admin');
  });

  it('should not recreate resources when they already exist', async () => {
    // Run repair again - resources already exist
    const result = await configService.repairDefaultSetup(tenantId);

    expect(result).toHaveProperty('status', 200);
    expect(result).toHaveProperty('tenantId', tenantId);

    // Verify group-role association exists
    const groupRoles = await groupRoleService.getGroupRoles(tenantId, {
      groupId: (
        await groupService.findOneByQuery(tenantId, { name: 'iam-admin' })
      )._id,
    });
    expect(groupRoles.length).toBeGreaterThan(0);
  });

  it('should use core realm when tenantId not provided', async () => {
    const result = await configService.repairDefaultSetup(undefined);

    expect(result).toHaveProperty('status', 200);
    expect(result).toHaveProperty('tenantId');
  });
});
