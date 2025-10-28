import { DocId } from '@/domains/commons/base/latest/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/latest/pagination.schema';
import { validateEmailUnique } from '@/domains/commons/validations/v1/validation.service';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { getLogger } from '@/utils/localStorage.util';
import bcrypt from 'bcrypt';
import { AccountDocument, getModel } from './account.model';
import { AccountCreate } from './account.schema';

export const create = async (
  tenantId: string,
  data: AccountCreate
): Promise<AccountDocument> => {
  const logger = await getLogger();

  try {
    logger.info({ tenantId, email: data.email }, 'Creating new account');

    // Validações de negócio
    await validateEmailUnique(tenantId, data.email);

    const dbName = await getDBName(tenantId);
    const account = await getModel(dbName).create({
      emails: [{ email: data.email, isPrimary: true }],
      password: data.password,
    });

    logger.info(
      { accountId: account._id, tenantId },
      'Account created successfully'
    );
    return account;
  } catch (error) {
    logger.error(
      { error, tenantId, email: data.email },
      'Failed to create account'
    );
    throw error;
  }
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Finding account by ID');

  const dbName = await getDBName(tenantId);
  const account = await getModel(dbName).findById(id);
  if (!account) {
    logger.warn({ tenantId, id }, 'Account not found');
    throw new NotFoundError('Account not found');
  }
  logger.info(
    { accountId: account._id, tenantId },
    'Account found successfully'
  );
  return account;
};

export const findByEmail = async (
  tenantId: string,
  email: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, email }, 'Finding account by email');

  const dbName = await getDBName(tenantId);
  const account = await getModel(dbName).findOne({
    'emails.email': email,
  });
  if (!account) {
    logger.warn({ tenantId, email }, 'Account not found by email');
    throw new NotFoundError('Account not found');
  }
  logger.info(
    { accountId: account._id, tenantId },
    'Account found by email successfully'
  );
  return account;
};

export const update = async (
  tenantId: string,
  id: string,
  data: { email?: string; password?: string }
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Updating account');

  const dbName = await getDBName(tenantId);
  const updateData: {
    emails?: Array<{ email: string; isPrimary: boolean }>;
    password?: string;
  } = {};

  if (data.email) {
    updateData.emails = [{ email: data.email, isPrimary: true }];
  }
  if (data.password) {
    updateData.password = data.password;
  }

  const account = await getModel(dbName).findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!account) {
    logger.warn({ tenantId, id }, 'Account not found for update');
    throw new NotFoundError('Account not found');
  }
  logger.info(
    { accountId: account._id, tenantId },
    'Account updated successfully'
  );
  return account;
};

export const comparePassword = async (
  account: AccountDocument,
  password: string
): Promise<boolean> => {
  const logger = await getLogger();
  logger.info({ accountId: account._id }, 'Comparing password for account');

  const isValid = await bcrypt.compare(password, account.password);
  logger.info(
    { accountId: account._id, isValid },
    'Password comparison completed'
  );

  return isValid;
};

export const softDelete = async (
  tenantId: string,
  id: string
): Promise<void> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Soft deleting account');

  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findByIdAndUpdate(id, {
    emails: [],
    password: null,
    salt: null,
  });
  if (!result) {
    logger.warn({ tenantId, id }, 'Account not found for deletion');
    throw new NotFoundError('Account not found');
  }
  logger.info({ tenantId, id }, 'Account soft deleted successfully');
};

export const findAll = async (tenantId: string): Promise<AccountDocument[]> => {
  const logger = await getLogger();
  logger.info({ tenantId }, 'Finding all accounts');

  const dbName = await getDBName(tenantId);
  const accounts = await getModel(dbName).find({});
  logger.info({ tenantId, count: accounts.length }, 'Found all accounts');
  return accounts;
};

export const findAllPaginated = async (
  tenantId: string,
  query: PaginationQuery
): Promise<PaginatedResponse<AccountDocument>> => {
  const logger = await getLogger();
  logger.info({ tenantId, query }, 'Finding accounts with pagination');

  const { page, limit, filter, sortBy, descending } = query;
  const dbName = await getDBName(tenantId);

  const skip = (page - 1) * limit;

  // Build filter query
  const filterQuery: Record<string, unknown> = {};
  if (filter) {
    filterQuery.$or = [
      { 'emails.email': { $regex: filter, $options: 'i' } },
      { _id: { $regex: filter, $options: 'i' } },
    ];
  }

  // Build sort query
  const sortQuery: Record<string, 1 | -1> = {};
  if (sortBy) {
    sortQuery[sortBy] = descending ? -1 : 1;
  } else {
    sortQuery['emails.email'] = 1; // Default sort by email ascending
  }

  // Execute queries
  const [accounts, total] = await Promise.all([
    getModel(dbName).find(filterQuery).sort(sortQuery).skip(skip).limit(limit),
    getModel(dbName).countDocuments(filterQuery),
  ]);

  const totalPages = Math.ceil(total / limit);

  logger.info(
    { tenantId, total, page, limit, totalPages },
    'Accounts pagination completed successfully'
  );

  return {
    data: accounts,
    pagination: {
      total,
      page: Number(page),
      rowsPerPage: Number(limit),
      totalPages,
    },
  };
};

export const remove = async (tenantId: string, id: string): Promise<void> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Removing account');

  await softDelete(tenantId, id);

  logger.info({ tenantId, id }, 'Account removed successfully');
};

export const resetPassword = async (
  tenantId: string,
  id: string,
  password: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Resetting account password');

  const dbName = await getDBName(tenantId);
  const account = await getModel(dbName).findByIdAndUpdate(
    id,
    { password },
    { new: true, runValidators: true }
  );
  
  if (!account) {
    logger.warn({ tenantId, id }, 'Account not found for password reset');
    throw new NotFoundError('Account not found');
  }
  
  logger.info(
    { accountId: account._id, tenantId },
    'Account password reset successfully'
  );
  return account;
};
