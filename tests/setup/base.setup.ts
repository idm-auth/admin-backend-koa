import { beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  initMainConnection,
  closeMainConnection,
} from '@/plugins/mongo.plugin';
import { initPino } from '@/plugins/pino.plugin';
import { initDotenv } from '@/plugins/dotenv.plugin';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  await initDotenv();
  await initPino();
  mongo = await MongoMemoryServer.create();
  await initMainConnection(mongo.getUri());

  globalThis.testMongo = mongo;
});

afterAll(async () => {
  await closeMainConnection();
  await mongo.stop();
});
