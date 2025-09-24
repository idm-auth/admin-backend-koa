import {
  UserDocument,
  getModel,
} from '@/models/db/realms/users/users.v1.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import { UserCreate, userCreateSchema } from '@/schemas/v1/user.schema';
import { getDBName } from '@/services/v1/realm.service';
import {
  validateEmailUnique,
  validateZod,
} from '@/services/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import bcrypt from 'bcrypt';

export const create = async (
  tenantId: string,
  args: UserCreate
): Promise<UserDocument> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });
  // Validações de negócio
  await validateZod(args, userCreateSchema);
  await validateEmailUnique(tenantId, args.email);

  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).create({
    emails: [{ email: args.email, isPrimary: true }],
    password: args.password,
  });

  return user;
};

export const findById = async (
  tenantId: string,
  args: { id: DocId }
): Promise<UserDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  await validateZod(args.id, DocIdSchema);
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findById(args.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export const findByEmail = async (
  tenantId: string,
  args: { email: string }
): Promise<UserDocument> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findOne({ 'emails.email': args.email });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    emails?: { email: string; isPrimary: boolean }[];
    password?: string;
  }
): Promise<UserDocument> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const user = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { emails: args.emails, password: args.password },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
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
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findByIdAndUpdate(args.id, {
    emails: [],
    password: null,
    salt: null,
  });
  if (!result) {
    throw new NotFoundError('User not found');
  }
};

export const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<void> => {
  return softDelete(tenantId, args);
};
