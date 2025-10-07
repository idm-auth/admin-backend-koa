import { NotFoundError } from '@/errors/not-found';
import {
  getModel,
  Realm,
  RealmDocumentID,
} from '@/models/db/core/realms/realms.v1.model';
import { PublicUUID } from '@/schemas/v1/base.schema';
import { getLogger } from '@/utils/localStorage.util';

export const create = async (args: {
  data: Omit<Realm, 'publicUUID'> & { publicUUID?: string };
}) => {
  const logger = await getLogger();
  logger.debug(args.data);

  const realm = await getModel().create(args.data);
  return realm;
};

export const findById = async (args: { id: string }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findById(args.id);
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
  return realm;
};

export const findByPublicUUID = async (args: { publicUUID: PublicUUID }) => {
  const logger = await getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().findOne({ publicUUID: args.publicUUID });
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
  return realm;
};

export const findByName = async (args: { name: string }) => {
  const logger = await getLogger();
  logger.debug({ name: args.name });

  const realm = await getModel().findOne({ name: args.name });
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
  return realm;
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
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
  return realm;
};

export const remove = async (args: { id: string }): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  const realm = await getModel().findByIdAndDelete(args.id);
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
};

export const getDBName = async (args: { publicUUID: PublicUUID }) => {
  const logger = await getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const realm = await getModel().findOne({ publicUUID: args.publicUUID });

  if (!realm || !realm.dbName) {
    throw new NotFoundError(
      `DBName not found for publicUUID: ${args.publicUUID}`
    );
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
  return doc;
};
