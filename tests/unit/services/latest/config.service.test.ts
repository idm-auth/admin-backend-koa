import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import service from '@/services/latest/config.service';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { WebAdminConfigModel } from '@/models/config/webAdminConfig.v1.model';

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
      name: 'web-admin',
      env: 'development',
      api: {
        main: {
          url: 'https://api.example.com',
        },
      },
    });

    const result = await service.getConfig({
      app: 'web-admin',
      env: 'development',
    });
    expect(result).toEqual(createdConfig.toObject());
  });
});
