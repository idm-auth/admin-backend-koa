import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import * as applicationRegistryService from '@/domains/core/application-registries/application-registry.service';
import { getTenantId } from '@test/utils/tenant.util';
import { EnvKey, setLocalMemValue } from '@/plugins/dotenv.plugin';
import { getModel } from '@/domains/core/application-registries/application-registry.model';
import { getCoreDb } from '@/plugins/mongo.plugin';
import { v4 as uuidv4 } from 'uuid';

describe('application-registry.service.create', () => {
  beforeAll(async () => {
    const coreDbName = 'vi-test-db-app-registry-create-error';
    setLocalMemValue(EnvKey.CORE_REALM_NAME, coreDbName);
    await getTenantId(coreDbName);
    await getModel().createIndexes();
  });

  it('should throw original error when database operation fails', async () => {
    const conn = getCoreDb();
    await conn.close();

    await expect(
      applicationRegistryService.create({
        applicationKey: uuidv4(),
        tenantId: uuidv4(),
        applicationId: uuidv4(),
      })
    ).rejects.toThrow();
  });

  afterAll(async () => {
    const conn = getCoreDb();
    if (conn.readyState === 0) {
      await conn.openUri(process.env.MONGODB_URI || '');
    }
  });
});
