import {
  UserDocument,
  getModel,
} from '@/models/db/realms/users/users.v1.model';
import { getDBName } from '@/services/latest/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import bcrypt from 'bcrypt';
import { validateUserCreate } from '@/services/latest/validation.service';
export const create = async (
  tenantId: string,
  args: {
    email: string;
    password: string;
  }
): Promise<UserDocument> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });

  // Validações de negócio
  await validateUserCreate(tenantId, args);

  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).create({
    emails: [{ email: args.email, isPrimary: true }],
    password: args.password,
  });

  return user;
};

export const findById = async (
  tenantId: string,
  args: { id: string }
): Promise<UserDocument | null> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findById(args.id);
  return user ? user : null;
};

export const findByEmail = async (
  tenantId: string,
  args: { email: string }
): Promise<UserDocument | null> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findOne({ 'emails.email': args.email });
  return user ? user : null;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    emails?: { email: string; isPrimary: boolean }[];
    password?: string;
  }
): Promise<UserDocument | null> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { emails: args.emails, password: args.password },
    { new: true, runValidators: true }
  );
  return user ? user : null;
};

export const comparePassword = async (
  user: UserDocument,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

export const softDelete = async (
  tenantId: string,
  args: { id: string }
): Promise<boolean> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findByIdAndUpdate(args.id, {
    emails: [],
    password: null,
    salt: null,
  });
  return !!result;
};

export const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<boolean> => {
  return softDelete(tenantId, args);
};
