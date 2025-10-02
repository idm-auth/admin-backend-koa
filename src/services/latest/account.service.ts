import {
  AccountDocument,
  getModel,
} from '@/models/db/realms/accounts/accounts.v1.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import {
  AccountCreate,
  accountCreateSchema,
} from '@/schemas/v1/account.schema';
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
  args: AccountCreate
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });
  // Validações de negócio
  await validateZod(args, accountCreateSchema);
  await validateEmailUnique(tenantId, args.email);

  const dbName = await getDBName({ publicUUID: tenantId });
  const account = await getModel(dbName).create({
    emails: [{ email: args.email, isPrimary: true }],
    password: args.password,
  });

  return account;
};

export const findById = async (
  tenantId: string,
  args: { id: DocId }
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  await validateZod(args.id, DocIdSchema);
  const dbName = await getDBName({ publicUUID: tenantId });
  const account = await getModel(dbName).findById(args.id);
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  return account;
};

export const findByEmail = async (
  tenantId: string,
  args: { email: string }
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.debug({ email: args.email });
  const dbName = await getDBName({ publicUUID: tenantId });
  const account = await getModel(dbName).findOne({
    'emails.email': args.email,
  });
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  return account;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    emails?: { email: string; isPrimary: boolean }[];
    password?: string;
  }
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const account = await getModel(dbName).findByIdAndUpdate(
    args.id,
    { emails: args.emails, password: args.password },
    { new: true, runValidators: true }
  );
  if (!account) {
    throw new NotFoundError('Account not found');
  }
  return account;
};

export const comparePassword = async (
  account: AccountDocument,
  password: string
): Promise<boolean> => {
  return bcrypt.compare(password, account.password);
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
    throw new NotFoundError('Account not found');
  }
};

export const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<void> => {
  return softDelete(tenantId, args);
};
