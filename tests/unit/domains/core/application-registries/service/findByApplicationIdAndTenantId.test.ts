import { describe, expect, it, beforeAll } from 'vitest';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { getTenantId } from '@test/utils/tenant.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { getModel } from '@/domains/core/application-registries/application-registry.model';
import { v4 as uuidv4 } from 'uuid';

describe('application-registry.service.findByApplicationIdAndTenantId', () => {
  beforeAll(async () => {
    const coreDbName = 'vi-test-db-app-registry-find-app-tenant';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    await getTenantId(coreDbName);
    await getModel().createIndexes();
  });

  it('should throw NotFoundError when registry not found', async () => {
    const nonExistentAppId = uuidv4();
    const nonExistentTenantId = uuidv4();

    await expect(
      applicationRegistryService.findByApplicationIdAndTenantId(
        nonExistentAppId,
        nonExistentTenantId
      )
    ).rejects.toThrow('Application registry not found');
  });

  it('should find registry by applicationId and tenantId', async () => {
    const applicationId = uuidv4();
    const tenantId = uuidv4();

    await applicationRegistryService.create({
      tenantId,
      applicationId,
    });

    const registry =
      await applicationRegistryService.findByApplicationIdAndTenantId(
        applicationId,
        tenantId
      );

    expect(registry).toHaveProperty('_id');
    expect(registry.applicationId).toBe(applicationId);
    expect(registry.tenantId).toBe(tenantId);
  });
});
