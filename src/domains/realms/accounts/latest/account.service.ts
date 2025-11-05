import { DocId } from '@/domains/commons/base/latest/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/latest/pagination.schema';

import { validateEmailUnique } from '@/domains/commons/validations/v1/validation.service';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { ValidationError } from '@/errors/validation';
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

// Account update function - Email e password não podem ser alterados aqui
// Email e password devem ter métodos específicos para alteração
export const update = async (
  tenantId: string,
  id: string,
  data: Record<string, unknown>
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Updating account');

  const dbName = await getDBName(tenantId);
  
  // Email e password são excluídos intencionalmente
  // Use métodos específicos: resetPassword() para senha
  const updateData = { ...data };
  delete updateData.email;
  delete updateData.password;

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

export const hardDelete = async (
  tenantId: string,
  id: string
): Promise<void> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Deleting account');

  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findByIdAndDelete(id);
  if (!result) {
    logger.warn({ tenantId, id }, 'Account not found for deletion');
    throw new NotFoundError('Account not found');
  }

  logger.info({ tenantId, id }, 'Account deleted successfully');
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

  await hardDelete(tenantId, id);

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

export const updatePassword = async (
  tenantId: string,
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id }, 'Updating account password');

  // Buscar account para validar senha atual
  const account = await findById(tenantId, id);
  
  // Validar senha atual
  const isCurrentPasswordValid = await comparePassword(account, currentPassword);
  if (!isCurrentPasswordValid) {
    throw new NotFoundError('Current password is incorrect');
  }

  const dbName = await getDBName(tenantId);
  const updatedAccount = await getModel(dbName).findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true, runValidators: true }
  );

  if (!updatedAccount) {
    throw new NotFoundError('Account not found');
  }

  logger.info(
    { accountId: updatedAccount._id, tenantId },
    'Account password updated successfully'
  );
  return updatedAccount;
};

export const addEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id, email }, 'Adding email to account');

  // Validar se email já existe no sistema
  await validateEmailUnique(tenantId, email);

  const account = await findById(tenantId, id);
  
  // Verificar se email já existe na conta
  const emailExists = account.emails.some(e => e.email === email);
  if (emailExists) {
    throw new NotFoundError('Email already exists in this account');
  }

  const dbName = await getDBName(tenantId);
  const updatedAccount = await getModel(dbName).findByIdAndUpdate(
    id,
    { $push: { emails: { email, isPrimary: false } } },
    { new: true, runValidators: true }
  );

  if (!updatedAccount) {
    throw new NotFoundError('Account not found');
  }

  logger.info(
    { accountId: updatedAccount._id, tenantId, email },
    'Email added successfully'
  );
  return updatedAccount;
};

export const removeEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id, email }, 'Removing email from account');

  const account = await findById(tenantId, id);
  
  // Verificar se é o único email
  if (account.emails.length <= 1) {
    throw new ValidationError('Cannot remove the only email from account');
  }

  // Verificar se email existe na conta
  const emailExists = account.emails.some(e => e.email === email);
  if (!emailExists) {
    throw new NotFoundError('Email not found in this account');
  }

  const dbName = await getDBName(tenantId);
  const updatedAccount = await getModel(dbName).findByIdAndUpdate(
    id,
    { $pull: { emails: { email } } },
    { new: true, runValidators: true }
  );

  if (!updatedAccount) {
    throw new NotFoundError('Account not found');
  }

  logger.info(
    { accountId: updatedAccount._id, tenantId, email },
    'Email removed successfully'
  );
  return updatedAccount;
};

export const setPrimaryEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<AccountDocument> => {
  const logger = await getLogger();
  logger.info({ tenantId, id, email }, 'Setting primary email');

  const account = await findById(tenantId, id);
  
  // Verificar se email existe na conta
  const emailExists = account.emails.some(e => e.email === email);
  if (!emailExists) {
    throw new NotFoundError('Email not found in this account');
  }

  const dbName = await getDBName(tenantId);
  
  // Remover isPrimary de todos os emails e definir o novo como primary
  await getModel(dbName).findByIdAndUpdate(
    id,
    { $set: { 'emails.$[].isPrimary': false } }
  );
  
  const updatedAccount = await getModel(dbName).findByIdAndUpdate(
    id,
    { $set: { 'emails.$[elem].isPrimary': true } },
    { 
      arrayFilters: [{ 'elem.email': email }],
      new: true, 
      runValidators: true 
    }
  );

  if (!updatedAccount) {
    throw new NotFoundError('Account not found');
  }

  logger.info(
    { accountId: updatedAccount._id, tenantId, email },
    'Primary email set successfully'
  );
  return updatedAccount;
};
