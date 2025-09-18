import { RealmModel } from '@/models/db/core/realms/realms.v1.model';
import { getLogger } from '@/utils/localStorage.util';

const create = async (args: { publicUUID: string; dbName: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const Model = await RealmModel();
  const realm = new Model({
    publicUUID: args.publicUUID,
    dbName: args.dbName,
  });

  await realm.save();
  return realm.toObject();
};

const findById = async (args: { id: string }) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const Model = await RealmModel();
  const realm = await Model.findById(args.id);
  return realm ? realm.toObject() : null;
};

const findByPublicUUID = async (args: { publicUUID: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const Model = await RealmModel();
  const realm = await Model.findOne({ publicUUID: args.publicUUID });
  return realm ? realm.toObject() : null;
};

const update = async (args: {
  id: string;
  publicUUID?: string;
  dbName?: string;
}) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const Model = await RealmModel();
  const realm = await Model.findByIdAndUpdate(
    args.id,
    { publicUUID: args.publicUUID, dbName: args.dbName },
    { new: true, runValidators: true }
  );
  return realm ? realm.toObject() : null;
};

const remove = async (args: { id: string }) => {
  const logger = getLogger();
  logger.debug({ id: args.id });

  const Model = await RealmModel();
  const realm = await Model.findByIdAndDelete(args.id);
  return realm ? true : false;
};

const getDBName = async (args: { publicUUID: string }) => {
  const logger = getLogger();
  logger.debug({ publicUUID: args.publicUUID });

  const Model = await RealmModel();
  const realm = await Model.findOne({ publicUUID: args.publicUUID });

  if (!realm || !realm.dbName) {
    throw new Error(`DBName not found for publicUUID: ${args.publicUUID}`);
  }

  return realm.dbName;
};

export default {
  create,
  findById,
  findByPublicUUID,
  update,
  remove,
  getDBName,
};
