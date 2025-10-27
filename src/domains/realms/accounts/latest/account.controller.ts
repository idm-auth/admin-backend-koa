import { getLogger } from '@/utils/localStorage.util';
import { Context } from 'koa';
import { AccountPaginatedResponse } from './account.schema';
import * as accountService from './account.service';
import * as accountMapper from './account.mapper';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const account = await accountService.create(
    tenantId,
    ctx.validated.body
  );

  ctx.status = 201;
  ctx.body = accountMapper.toCreateResponse(account);
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
  const { tenantId, id } = ctx.validated.params;
  const updateData = ctx.validated.body;

  const account = await accountService.update(
    tenantId,
    id,
    updateData
  );

  ctx.body = accountMapper.toUpdateResponse(account);
};

export const findAll = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;

  const accounts = await accountService.findAll(tenantId);

  ctx.body = accounts.map(accountMapper.toListItemResponse);
};

export const findAllPaginated = async (ctx: Context) => {
  const logger = await getLogger();
  const { tenantId } = ctx.validated.params;
  const query = ctx.validated.query;
  logger.debug(query, 'findAllPaginated query:');

  const serviceResult = await accountService.findAllPaginated(
    tenantId,
    query
  );

  const data = serviceResult.data.map(accountMapper.toListItemResponse);

  const result: AccountPaginatedResponse = {
    data,
    pagination: serviceResult.pagination,
  };

  ctx.body = result;
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  await accountService.remove(tenantId, id);

  ctx.status = 204;
};
