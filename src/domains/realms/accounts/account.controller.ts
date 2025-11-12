import { getLogger } from '@/utils/localStorage.util';
import { Context } from 'koa';
import { AccountPaginatedResponse } from './account.schema';
import * as accountService from './account.service';
import * as accountMapper from './account.mapper';

export const create = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId } = ctx.validated.params;
  logger.debug(
    { tenantId, body: ctx.validated.body },
    'Try create new account'
  );

  try {
    const account = await accountService.create(tenantId, ctx.validated.body);

    logger.info(
      { tenantId, accountId: account._id },
      'Account created successfully'
    );

    ctx.status = 201;
    ctx.body = accountMapper.toCreateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        email: ctx.validated.body?.email,
      },
      'Failed to create account'
    );
    throw error;
  }
};

export const findById = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;

  try {
    const account = await accountService.findById(tenantId, id);
    ctx.body = accountMapper.toCreateResponse(account);
  } catch (error) {
    logger.error({ error, tenantId, id }, 'Failed to find account by ID');
    throw error;
  }
};

export const update = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  try {
    const account = await accountService.update(tenantId, id, updateData);

    logger.info({ tenantId, accountId: id }, 'Account updated successfully');

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
      },
      'Failed to update account'
    );
    throw error;
  }
};

export const findAllPaginated = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId } = ctx.validated.params;
  const query = ctx.validated.query;

  try {
    logger.debug({ tenantId, query }, 'Finding paginated accounts');

    const serviceResult = await accountService.findAllPaginated(
      tenantId,
      query
    );

    const data = serviceResult.data.map(accountMapper.toListItemResponse);

    const result: AccountPaginatedResponse = {
      data,
      pagination: serviceResult.pagination,
    };

    logger.debug(
      { tenantId, total: serviceResult.pagination.total },
      'Retrieved paginated accounts'
    );

    ctx.body = result;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        query,
      },
      'Failed to retrieve paginated accounts'
    );
    throw error;
  }
};

export const remove = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;

  try {
    await accountService.remove(tenantId, id);

    logger.info({ tenantId, accountId: id }, 'Account removed successfully');

    ctx.status = 204;
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
      },
      'Failed to remove account'
    );
    throw error;
  }
};

export const resetPassword = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const { password } = ctx.validated.body;

  try {
    const account = await accountService.resetPassword(tenantId, id, password);

    logger.info(
      { tenantId, accountId: id },
      'Account password reset successfully'
    );

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
      },
      'Failed to reset account password'
    );
    throw error;
  }
};

export const updatePassword = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const { currentPassword, newPassword } = ctx.validated.body;

  try {
    const account = await accountService.updatePassword(
      tenantId,
      id,
      currentPassword,
      newPassword
    );

    logger.info(
      { tenantId, accountId: id },
      'Account password updated successfully'
    );

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
      },
      'Failed to update account password'
    );
    throw error;
  }
};

export const addEmail = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const { email } = ctx.validated.body;

  try {
    const account = await accountService.addEmail(tenantId, id, email);

    logger.info(
      { tenantId, accountId: id, email },
      'Email added to account successfully'
    );

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
        email,
      },
      'Failed to add email to account'
    );
    throw error;
  }
};

export const removeEmail = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const { email } = ctx.validated.body;

  try {
    const account = await accountService.removeEmail(tenantId, id, email);

    logger.info(
      { tenantId, accountId: id, email },
      'Email removed from account successfully'
    );

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
        email,
      },
      'Failed to remove email from account'
    );
    throw error;
  }
};

export const setPrimaryEmail = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId, id } = ctx.validated.params;
  const { email } = ctx.validated.body;

  try {
    const account = await accountService.setPrimaryEmail(tenantId, id, email);

    logger.info(
      { tenantId, accountId: id, email },
      'Primary email set successfully'
    );

    ctx.body = accountMapper.toUpdateResponse(account);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
        accountId: id,
        email,
      },
      'Failed to set primary email'
    );
    throw error;
  }
};
