import * as service from '@/domains/config/config.service';
import { getModel } from '@/domains/config/webAdminConfig.model';
import { webAdminConfigZSchema } from '@/domains/commons/base/webAdminConfig.schema';
import { v4 as uuidv4 } from 'uuid';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';

describe('config.service', () => {
  const originalDbName = process.env.MONGODB_CORE_DBNAME;

  beforeAll(() => {
    process.env.MONGODB_CORE_DBNAME = 'vi-test-db-config-service';
  });

  afterAll(() => {
    process.env.MONGODB_CORE_DBNAME = originalDbName;
  });

  it('getConfig.OK', async () => {
    const createdConfig = await getModel().create({
      app: 'web-admin',
      env: 'development',
      api: {
        main: {
          url: 'https://api.example.com',
        },
      },
      coreRealm: {
        publicUUID: uuidv4(),
      },
    });
    const compareTo = webAdminConfigZSchema.parse(createdConfig.toObject());
    const result = await service.getWebAdminConfig({
      app: 'web-admin',
      env: 'development',
    });
    expect(result).toEqual(compareTo);
  });
});
