import { RealmModel } from '@/models/db/core/realms/realms.v1.model';
import mongoose, { Connection } from 'mongoose';
import { getLogger } from '@/plugins/pino.plugin';

let mainConnection: Connection;

// cache em memória de tenants
type RealmInfo = { publicUUID: string; dbName: string };
const tenantCache = new Map<string, RealmInfo>();

// cria apenas uma conexão principal
export const initMainConnection = async (mongodbUri?: string) => {
  const mongodbUriCfg = mongodbUri || process.env.MONGODB_URI;
  if (!mongodbUriCfg) throw new Error('process.env.MONGODB_URI é requerido');
  const logger = await getLogger();
  logger.info('Inicializando conexão principal com MongoDB...');
  logger.info(`MongoDB URI: ${mongodbUriCfg}`);
  if (!mainConnection) {
    mainConnection = await mongoose.createConnection(mongodbUriCfg);
  }
  return mainConnection;
};

export const injectMainConnection = async (argMainConnection: Connection) => {
  if (!mainConnection) {
    mainConnection = argMainConnection;
  }
};
// acesso fixo ao core
export const getCoreDb = async (): Promise<Connection> => {
  const mongodbCoreDBname = process.env.MONGODB_CORE_DBNAME || 'idm-core-db';
  if (!mainConnection) throw new Error('Conexão principal não inicializada');
  return mainConnection.useDb(mongodbCoreDBname, { useCache: true });
};

// acesso dinâmico a um realm
export const getRealmDb = async (tenantId: string): Promise<Connection> => {
  if (!mainConnection) throw new Error('Conexão principal não inicializada');

  // consulta cache
  let realmInfo = tenantCache.get(tenantId);

  if (!realmInfo) {
    const model = await RealmModel();
    const realmDoc = await model.findOne({ publicUUID: tenantId }).lean();
    if (!realmDoc) throw new Error(`Tenant não encontrado: ${tenantId}`);

    realmInfo = { publicUUID: realmDoc.publicUUID, dbName: realmDoc.dbName };
    tenantCache.set(tenantId, realmInfo);
  }

  return mainConnection.useDb(realmInfo.dbName, { useCache: true });
};
