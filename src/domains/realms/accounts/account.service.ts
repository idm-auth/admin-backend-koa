import {
  DocId,
  Password,
  passwordSchema,
} from '@/domains/commons/base/base.schema';
import {
  PaginatedResponse,
  PaginationQuery,
} from '@/domains/commons/base/pagination.schema';

import { validateEmailUnique } from '@/domains/commons/validations/validation.service';
import { getDBName } from '@/domains/core/realms/realm.service';
import { NotFoundError } from '@/errors/not-found';
import { ValidationError } from '@/errors/validation';
import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { executePagination } from '@/utils/pagination.util';
import bcrypt from 'bcrypt';
import { Account, getModel } from './account.model';
import { AccountCreate, AccountUpdate } from './account.schema';

const SERVICE_NAME = 'account';

export const create = async (
  tenantId: string,
  data: AccountCreate
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.create`,
      attributes: {
        'tenant.id': tenantId,
        'account.email': data.email,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, email: data.email }, 'Creating new account');

      await validateEmailUnique(tenantId, data.email);
      const dbName = await getDBName({ publicUUID: tenantId });

      const account = await getModel(dbName).create({
        emails: [{ email: data.email, isPrimary: true }],
        password: data.password,
      });

      span.setAttributes({
        'account.id': account._id,
        'db.name': dbName,
      });

      logger.info(
        { accountId: account._id, tenantId },
        'Account created successfully'
      );

      return account;
    }
  );
};

export const findById = async (
  tenantId: string,
  id: DocId
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findById`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        operation: 'findById',
      },
    },
    async (span) => {
      const logger = await getLogger();

      logger.info({ tenantId, id }, 'Finding account by ID');

      const dbName = await getDBName({ publicUUID: tenantId });
      const account = await getModel(dbName).findById(id);

      if (!account) {
        logger.warn({ tenantId, id }, 'Account not found');
        throw new NotFoundError('Account not found');
      }

      span.setAttributes({ 'db.name': dbName });
      logger.info(
        { accountId: account._id, tenantId },
        'Account found successfully'
      );

      return account;
    }
  );
};

export const findByEmail = async (
  tenantId: string,
  email: string
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findByEmail`,
      attributes: {
        'tenant.id': tenantId,
        'account.email': email,
        operation: 'findByEmail',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, email }, 'Finding account by email');

      const dbName = await getDBName({ publicUUID: tenantId });
      const account = await getModel(dbName).findOne({
        'emails.email': email,
      });
      if (!account) {
        logger.warn({ tenantId, email }, 'Account not found by email');
        throw new NotFoundError('Account not found');
      }

      span.setAttributes({ 'db.name': dbName, 'account.id': account._id });
      logger.info(
        { accountId: account._id, tenantId },
        'Account found by email successfully'
      );
      return account;
    }
  );
};

// Account update function - Email e password não podem ser alterados aqui
// Email e password devem ter métodos específicos para alteração
export const update = async (
  tenantId: string,
  id: string,
  data: AccountUpdate
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.update`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        operation: 'update',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Updating account');

      const account = await findById(tenantId, id);

      // Update ainda não faz nada, porque nao tem nada o que fazer mesmo
      logger.debug({ data }, 'Updating account data');
      const updatedAccount = await account.save();

      span.setAttributes({ 'account.id': updatedAccount._id });
      logger.info(
        { accountId: updatedAccount._id, tenantId },
        'Account updated successfully'
      );
      return updatedAccount;
    }
  );
};

export const comparePassword = async (
  account: Account,
  password: Password
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

export const remove = async (tenantId: string, id: string): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.remove`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        operation: 'remove',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Deleting account');

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findByIdAndDelete(id);
      if (!result) {
        logger.warn({ tenantId, id }, 'Account not found for deletion');
        throw new NotFoundError('Account not found');
      }

      span.setAttributes({ 'db.name': dbName });
      logger.info({ tenantId, id }, 'Account deleted successfully');
    }
  );
};

export const findAllPaginated = async (
  tenantId: string,
  query: PaginationQuery
): Promise<PaginatedResponse<Account>> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.findAllPaginated`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findAllPaginated',
        'pagination.page': query.page,
        'pagination.limit': query.limit,
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, query }, 'Finding accounts with pagination');

      try {
        const dbName = await getDBName({ publicUUID: tenantId });
        span.setAttributes({ 'db.name': dbName });

        const result = await executePagination(
          {
            model: getModel(dbName),
            query,
            defaultSortField: 'emails.email',
            span,
          },
          (sanitizedFilter: string) => ({
            $or: [
              { 'emails.email': { $regex: sanitizedFilter, $options: 'i' } },
              { _id: { $regex: sanitizedFilter, $options: 'i' } },
            ],
          })
        );

        logger.info(
          {
            tenantId,
            total: result.pagination.total,
            page: result.pagination.page,
          },
          'Accounts pagination completed successfully'
        );

        return result;
      } catch (error) {
        logger.error(error, 'Failed to find paginated accounts');
        throw new Error('Failed to retrieve accounts');
      }
    }
  );
};

export const resetPassword = async (
  tenantId: string,
  id: string,
  password: Password
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.resetPassword`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        operation: 'resetPassword',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Resetting account password');

      // Validar senha com Zod
      const passwordParsed = passwordSchema.parse(password);
      const account = await findById(tenantId, id);

      try {
        // Atualizar senha usando o account já encontrado
        // NOSONAR: Password hashing is handled by Mongoose pre-save hook
        // See account.model.ts line 33-40 for bcrypt.hash() implementation
        account.password = passwordParsed;
        const updatedAccount = await account.save();

        span.setAttributes({ 'account.id': updatedAccount._id });
        logger.info(
          { accountId: updatedAccount._id, tenantId },
          'Account password reset successfully'
        );
        return updatedAccount;
      } catch (error) {
        logger.error(
          { error, tenantId, id },
          'Error resetting account password'
        );
        throw error;
      }
    }
  );
};

export const updatePassword = async (
  tenantId: string,
  id: string,
  currentPassword: Password,
  newPassword: Password
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.updatePassword`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        operation: 'updatePassword',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id }, 'Updating account password');

      // Validar senhas com Zod
      const newPasswordParsed = passwordSchema.parse(newPassword);

      // Buscar account para validar senha atual
      const account = await findById(tenantId, id);

      // Validar senha atual
      const isCurrentPasswordValid = await comparePassword(
        account,
        currentPassword
      );
      if (!isCurrentPasswordValid) {
        throw new NotFoundError('Current password is incorrect');
      }

      try {
        // Atualizar senha usando o account já encontrado
        // NOSONAR: Password hashing is handled by Mongoose pre-save hook
        // See account.model.ts line 33-40 for bcrypt.hash() implementation
        account.password = newPasswordParsed;
        const updatedAccount = await account.save();

        span.setAttributes({ 'account.id': updatedAccount._id });
        logger.info(
          { accountId: updatedAccount._id, tenantId },
          'Account password updated successfully'
        );
        return updatedAccount;
      } catch (error) {
        logger.error(
          { error, tenantId, id },
          'Error updating account password'
        );
        throw error;
      }
    }
  );
};

export const addEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.addEmail`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        'account.email': email,
        operation: 'addEmail',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id, email }, 'Adding email to account');

      // Validar se email já existe no sistema
      await validateEmailUnique(tenantId, email);

      const account = await findById(tenantId, id);

      // Verificar se email já existe na conta
      const emailExists = account.emails.some((e) => e.email === email);
      if (emailExists) {
        throw new NotFoundError('Email already exists in this account');
      }

      // Adicionar email usando o account já encontrado
      account.emails.push({ email, isPrimary: false });
      const updatedAccount = await account.save();

      span.setAttributes({ 'account.id': updatedAccount._id });
      logger.info(
        { accountId: updatedAccount._id, tenantId, email },
        'Email added successfully'
      );
      return updatedAccount;
    }
  );
};

export const removeEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.removeEmail`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        'account.email': email,
        operation: 'removeEmail',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id, email }, 'Removing email from account');

      const account = await findById(tenantId, id);

      // Verificar se é o único email
      if (account.emails.length <= 1) {
        throw new ValidationError('Cannot remove the only email from account');
      }

      // Verificar se email existe na conta
      const emailToRemove = account.emails.find((e) => e.email === email);
      if (!emailToRemove) {
        throw new NotFoundError('Email not found in this account');
      }

      // Remover email
      account.emails.pull(emailToRemove);
      const updatedAccount = await account.save();

      span.setAttributes({ 'account.id': updatedAccount._id });
      logger.info(
        { accountId: updatedAccount._id, tenantId, email },
        'Email removed successfully'
      );
      return updatedAccount;
    }
  );
};

export const setPrimaryEmail = async (
  tenantId: string,
  id: string,
  email: string
): Promise<Account> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.service.setPrimaryEmail`,
      attributes: {
        'tenant.id': tenantId,
        'account.id': id,
        'account.email': email,
        operation: 'setPrimaryEmail',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, id, email }, 'Setting primary email');

      const account = await findById(tenantId, id);

      // Verificar se email existe na conta
      const emailExists = account.emails.some((e) => e.email === email);
      if (!emailExists) {
        throw new NotFoundError('Email not found in this account');
      }

      // Atualizar isPrimary
      account.emails.forEach((e) => {
        e.isPrimary = e.email === email;
      });

      const updatedAccount = await account.save();

      span.setAttributes({ 'account.id': updatedAccount._id });
      logger.info(
        { accountId: updatedAccount._id, tenantId, email },
        'Primary email set successfully'
      );
      return updatedAccount;
    }
  );
};
