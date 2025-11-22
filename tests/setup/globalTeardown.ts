import {
  initMainConnection,
  closeMainConnection,
  getMainConnection,
} from '@/plugins/mongo.plugin';
import { initDotenv, getEnvValue, EnvKey } from '@/plugins/dotenv.plugin';

export default async function globalTeardown() {
  await initDotenv();
  const mongoUri = getEnvValue(EnvKey.MONGODB_URI);
  await initMainConnection(mongoUri);

  const connection = getMainConnection();
  if (!connection.db) {
    throw new Error(
      'connection.db is undefined - connection not properly initialized'
    );
  }

  const admin = connection.db.admin();
  const { databases } = await admin.listDatabases();

  console.log('\n[Global Teardown] Cleaning test databases...');
  console.log(
    'Databases found:',
    databases.map((d) => d.name)
  );

  for (const db of databases) {
    if (db.name.startsWith('vi-test-db')) {
      console.log('Dropping database:', db.name);
      await connection.useDb(db.name).dropDatabase();
    }
  }

  await closeMainConnection();
  console.log('[Global Teardown] Cleanup completed\n');
}
