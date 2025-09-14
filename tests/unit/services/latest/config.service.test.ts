import { WebAdminConfigModel } from '@/models/db/core/config/webAdminConfig.v1.model';
import service from '@/services/latest/config.service';
import { webAdminConfigZSchema } from '@idm-auth/backend-communications-schema/config/v1/webAdmin/response';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), {
    dbName: `config_service_${Date.now()}`,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('config.service', () => {
  it('getConfig.OK', async () => {
    const createdConfig = await WebAdminConfigModel.create({
      app: 'web-admin',
      env: 'development',
      api: {
        main: {
          url: 'https://api.example.com',
        },
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
