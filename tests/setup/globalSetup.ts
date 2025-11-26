import { EnvKey, getEnvValue, initDotenv } from '@/plugins/dotenv.plugin';
import {
  closeMainConnection,
  getMainConnection,
  initMainConnection,
} from '@/plugins/mongo.plugin';
import { initPino } from '@/plugins/pino.plugin';

let setupHappened = false;

export async function setup() {
  if (setupHappened) {
    throw new Error('[Global Setup] setup called twice');
  }
  setupHappened = true;
  await initDotenv();
  await initPino();
  const mongoUri = getEnvValue(EnvKey.MONGODB_URI);
  await initMainConnection(mongoUri);

  const connection = getMainConnection();
  if (!connection.db) {
    throw new Error(
      '[Global Setup] connection.db is undefined - connection not properly initialized'
    );
  }

  const admin = connection.db.admin();
  const { databases } = await admin.listDatabases();
  console.log('[Global Setup] Cleaning test databases before start...');
  for (const db of databases) {
    if (db.name.startsWith('vi-test-db')) {
      console.log('[Global Setup] Dropping database:', db.name);
      await connection.useDb(db.name).dropDatabase();
    }
  }
  await closeMainConnection();
  console.log('[Global Setup] Environment ready\n');
}
