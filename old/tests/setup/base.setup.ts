import { beforeAll, afterAll } from 'vitest';
import {
  initMainConnection,
  closeMainConnection,
} from '@/plugins/mongo.plugin';
import { initPino } from '@/plugins/pino.plugin';
import { initDotenv, getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';

beforeAll(async () => {
  await initDotenv();
  await initPino();
  const mongoUri = getEnvValue(EnvKey.MONGODB_URI);
  await initMainConnection(mongoUri);
});

afterAll(async () => {
  await closeMainConnection();
});
