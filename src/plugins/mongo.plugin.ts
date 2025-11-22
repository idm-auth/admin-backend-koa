import mongoose, { Connection } from 'mongoose';
import { getLogger } from '@/plugins/pino.plugin';
import { getEnvValue, EnvKey } from './dotenv.plugin';

export type DBName = string;
let mainConnection: Connection | null = null;

// cria apenas uma conexão principal
export const initMainConnection = async (mongodbUri?: string) => {
  const mongodbUriCfg = mongodbUri || getEnvValue(EnvKey.MONGODB_URI);
  if (!mongodbUriCfg) throw new Error('MONGODB_URI é requerido');
  const logger = await getLogger();
  logger.info('Inicializando conexão principal com MongoDB...');
  const sanitizedUri = mongodbUriCfg.replace(
    /:\/\/[^:]+:[^@]+@/,
    '://***:***@'
  );
  logger.info({ mongodbUri: sanitizedUri }, 'MongoDB URI configured');
  if (!mainConnection) {
    const pconn = mongoose.createConnection(mongodbUriCfg).asPromise();
    mainConnection = await pconn;
  }
  return mainConnection;
};

export const initMongo = async () => {
  return initMainConnection();
};

// acesso fixo ao core
export const getCoreDb = (): Connection => {
  const mongodbCoreDBname = getEnvValue(EnvKey.MONGODB_CORE_DBNAME);
  if (!mainConnection) throw new Error('Conexão principal não inicializada');
  return mainConnection.useDb(mongodbCoreDBname, { useCache: true });
};

// acesso dinâmico a um realm
export const getRealmDb = (dbName: DBName): Connection => {
  if (!mainConnection) throw new Error('Conexão principal não inicializada');
  return mainConnection.useDb(dbName, { useCache: true });
};

export const getMainConnection = (): Connection => {
  if (!mainConnection) throw new Error('Conexão principal não inicializada');
  return mainConnection;
};

export const closeMainConnection = async () => {
  const logger = await getLogger();
  if (mainConnection) {
    logger.info('Fechando conexão principal com MongoDB...');
    await mainConnection.close();
    mainConnection = null;
  }
};
