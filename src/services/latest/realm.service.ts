import { getModel } from '@/models/db/core/realms/realms.v1.model';
import { getLogger } from '@/utils/localStorage.util';

const create = async (args: { publicUUID: string; dbName: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().create({
    publicUUID: args.publicUUID,
    dbName: args.dbName,
  });
  return realm.toObject();
};

const findById = async (args: { id: string }) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findById(args.id);
  return realm ? realm.toObject() : null;
};

const findByPublicUUID = async (args: { publicUUID: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().findOne({ publicUUID: args.publicUUID });
  return realm ? realm.toObject() : null;
};

const update = async (args: {
  id: string;
  publicUUID?: string;
  dbName?: string;
}) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findByIdAndUpdate(
    args.id,
    { publicUUID: args.publicUUID, dbName: args.dbName },
    { new: true, runValidators: true }
  );
  return realm ? realm.toObject() : null;
};

const remove = async (args: { id: string }) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findByIdAndDelete(args.id);
  return realm ? true : false;
};

const getDBName = async (args: { publicUUID: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().findOne({ publicUUID: args.publicUUID });

  if (!realm || !realm.dbName) {
    throw new Error(`DBName not found for publicUUID: ${args.publicUUID}`);
  }

  return realm.dbName;
};
export const initSetup = async () => {
  const mongoDBCoreDBName = process.env.MONGODB_CORE_DBNAME;
  if (!mongoDBCoreDBName) {
    throw new Error('MONGODB_CORE_DBNAME is not set');
  }
  let doc = await getModel().findOne({ dbName: mongoDBCoreDBName });
  if (!doc) {
    doc = await getModel().create({
      dbName: mongoDBCoreDBName,
    });
  }
  return doc.toObject();
};
export default {
  initSetup,
  create,
  findById,
  findByPublicUUID,
  update,
  remove,
  getDBName,
};
