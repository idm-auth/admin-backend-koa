import { validateZod } from '@/domains/commons/validations/v1/validation.service';
import { getModel, Realm } from '@/domains/core/realms/latest/realms.model';
import { NotFoundError } from '@/errors/not-found';
import {
  DocIdSchema,
  publicUUIDSchema,
} from '@/domains/commons/base/latest/base.schema';
import { PublicUUID } from '@/domains/commons/base/v1/base.schema';
import { getLogger } from '@/utils/localStorage.util';
import { realmCreateSchema } from './realm.schema';

export const create = async (args: {
  data: Omit<Realm, 'publicUUID'> & { publicUUID?: string };
}) => {
  const logger = await getLogger();
  logger.debug(args.data);

  await validateZod(args.data, realmCreateSchema);

  const realm = await getModel().create(args.data);
  return realm;
};

export const findById = async (args: { id: string }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  await validateZod(args.id, DocIdSchema);

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

export const update = async (args: { id: string; data: Partial<Realm> }) => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  await validateZod(args.id, DocIdSchema);

  const realm = await getModel().findByIdAndUpdate(args.id, args.data, {
    new: true,
    runValidators: true,
  });
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
  return realm;
};

export const findAll = async () => {
  const logger = await getLogger();
  logger.debug('Finding all realms');

  const realms = await getModel().find({});
  return realms;
};

export const remove = async (args: { id: string }): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });

  await validateZod(args.id, DocIdSchema);

  const realm = await getModel().findByIdAndDelete(args.id);
  if (!realm) {
    throw new NotFoundError('Realm not found');
  }
};

export const getDBName = async (args: { publicUUID: PublicUUID }) => {
  const logger = await getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  // Validar formato do publicUUID antes de buscar
  await validateZod(args.publicUUID, publicUUIDSchema);

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
  let doc = await getModel().findOne({
    dbName: mongoDBCoreDBName,
  });
  if (!doc) {
    doc = await getModel().create({
      dbName: mongoDBCoreDBName,
      name: 'idm-core-realm',
      description: 'Realm Core',
    });
  }
  return doc;
};
