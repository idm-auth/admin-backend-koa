import * as service from '@/domains/config/latest/config.service';
import { getModel } from '@/domains/config/v1/webAdminConfig.model';
import { webAdminConfigZSchema } from '@/domains/commons/base/v1/webAdminConfig.schema';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';

describe('config.service', () => {
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
