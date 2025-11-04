import { getLogger } from '@/utils/localStorage.util';
import { Context } from 'koa';
import { AccountPaginatedResponse } from './account.schema';
import * as accountService from './account.service';
import * as accountMapper from './account.mapper';

export const create = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId } = ctx.validated.params;

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

export const findAll = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId } = ctx.validated.params;

  try {
    const accounts = await accountService.findAll(tenantId);

    logger.debug(
      { tenantId, count: accounts.length },
      'Retrieved all accounts'
    );

    ctx.body = accounts.map(accountMapper.toListItemResponse);
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        tenantId,
      },
      'Failed to retrieve all accounts'
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
