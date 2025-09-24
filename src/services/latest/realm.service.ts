import {
  getModel,
  Realm,
  RealmDocumentID,
} from '@/models/db/core/realms/realms.v1.model';
import { getLogger } from '@/utils/localStorage.util';

export const create = async (args: {
  data: Omit<Realm, 'publicUUID'> & { publicUUID?: string };
}) => {
  const logger = await getLogger();
  logger.debug(args.data);

  const realm = await getModel().create(args.data);
  return realm.toObject();
};

export const findById = async (args: { id: string }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findById(args.id);
  return realm ? realm.toObject() : null;
};

export const findByPublicUUID = async (args: { publicUUID: string }) => {
  const logger = await getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().findOne({ publicUUID: args.publicUUID });
  return realm ? realm.toObject() : null;
};

export const findByName = async (args: { name: string }) => {
  const logger = await getLogger();
  logger.debug({ name: args.name });

  const realm = await getModel().findOne({ name: args.name });
  return realm ? realm.toObject() : null;
};

export const update = async (args: { id: string; data: RealmDocumentID }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, ...updateData } = args.data;
  const realm = await getModel().findByIdAndUpdate(args.id, updateData, {
    new: true,
    runValidators: true,
  });
  return realm ? realm.toObject() : null;
};

export const remove = async (args: { id: string }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findByIdAndDelete(args.id);
  return realm ? true : false;
};

export const getDBName = async (args: { publicUUID: string }) => {
  const logger = await getLogger();
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
