import {
  UserDocument,
  getModel,
} from '@/models/db/realms/users/users.v1.model';
import realmService from '@/services/latest/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import bcrypt from 'bcrypt';
import { ValidationError } from '@/errors/validation';

const create = async (
  tenantId: string,
  args: {
    email: string;
    password: string;
  }
): Promise<UserDocument> => {
  const logger = getLogger();
  logger.debug({ email: args.email });

  // Validações de negócio
  if (!args.email) {
    throw new ValidationError('Email is required');
  }
  if (!args.password) {
    throw new ValidationError('Password is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
    throw new ValidationError('Invalid email format');
  }

  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).create({
    emails: [{ email: args.email, isPrimary: true }],
    password: args.password,
  });

  return user;
};

const findById = async (
  tenantId: string,
  args: { id: string }
): Promise<UserDocument | null> => {
  const logger = getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findById(args.id);
  return user ? user : null;
};

const findByEmail = async (
  tenantId: string,
  args: { email: string }
): Promise<UserDocument | null> => {
  const logger = getLogger();
  logger.debug({ email: args.email });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findOne({ 'emails.email': args.email });
  return user ? user : null;
};

const update = async (
  tenantId: string,
  args: {
    id: string;
    emails?: { email: string; isPrimary: boolean }[];
    password?: string;
  }
): Promise<UserDocument | null> => {
  const logger = getLogger();
  logger.debug({ id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { emails: args.emails, password: args.password },
    { new: true, runValidators: true }
  );
  return user ? user : null;
};

const comparePassword = async (
  user: UserDocument,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

const softDelete = async (
  tenantId: string,
  args: { id: string }
): Promise<boolean> => {
  const logger = getLogger();
  logger.debug({ id: args.id });
  const dbName = await realmService.getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findByIdAndUpdate(args.id, {
    emails: [],
    password: null,
    salt: null,
  });
  return !!result;
};

const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<boolean> => {
  return softDelete(tenantId, args);
};

export default {
  create,
  findById,
  findByEmail,
  update,
  remove,
  comparePassword,
  softDelete,
};
