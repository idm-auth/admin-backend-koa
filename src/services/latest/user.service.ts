import { User, getModel } from '@/models/db/realms/users/users.v1.model';
import { getLogger } from '@/utils/localStorage.util';
import realmService from '@/services/latest/realm.service';

const create = async (
  tenantId: string,
  args: {
    email: string;
    password: string;
  }
): Promise<User> => {
  const logger = getLogger();
  logger.debug({ email: args.email });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).create({
    email: args.email,
    password: args.password,
  });

  return user.toObject();
};

const findById = async (
  tenantId: string,
  args: { id: string }
): Promise<User | null> => {
  const logger = getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findById(args.id);
  return user ? user.toObject() : null;
};

const findByEmail = async (
  tenantId: string,
  args: { email: string }
): Promise<User | null> => {
  const logger = getLogger();
  logger.debug({ email: args.email });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findOne({ email: args.email });
  return user ? user.toObject() : null;
};

const update = async (
  tenantId: string,
  args: {
    id: string;
    email?: string;
    password?: string;
  }
): Promise<User | null> => {
  const logger = getLogger();
  logger.debug({ id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { email: args.email, password: args.password },
    { new: true, runValidators: true }
  );
  return user ? user.toObject() : null;
};

const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<boolean> => {
  const logger = getLogger();
  logger.debug({ id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findById(args.id);
  if (!user) return false;

  await user.softDelete();
  return true;
};

export default { create, findById, findByEmail, update, remove };
