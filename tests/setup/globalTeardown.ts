import {
  initMainConnection,
  closeMainConnection,
  getMainConnection,
} from '@/plugins/mongo.plugin';
import { initDotenv, getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';

let teardownHappened = false;

export async function teardown() {
  if (teardownHappened) {
    throw new Error('[Global Teardown] teardown called twice');
  }

  await initDotenv();
  const mongoUri = getEnvValue(EnvKey.MONGODB_URI);
  await initMainConnection(mongoUri);

  const connection = getMainConnection();
  if (!connection.db) {
    throw new Error(
      '[Global Teardown] connection.db is undefined - connection not properly initialized'
    );
  }

  const admin = connection.db.admin();
  const { databases } = await admin.listDatabases();
  console.log('[Global Teardown] Cleaning test databases...');
  for (const db of databases) {
    if (db.name.startsWith('vi-test-db')) {
      await connection.useDb(db.name).dropDatabase();
    }
  }
  await closeMainConnection();
  console.log('[Global Teardown] Cleanup completed\n');
}
