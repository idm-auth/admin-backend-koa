import * as accountGroupService from './account-group.service';
import * as accountGroupMapper from './account-group.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'account-group.controller';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: {
        operation: 'create',
        'http.method': 'POST',
      },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const data = ctx.validated.body;

      const accountGroup = await accountGroupService.create(tenantId, data);

      ctx.status = 201;
      ctx.body = accountGroupMapper.toResponse(accountGroup);
    }
  );
};

export const remove = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.remove`,
      attributes: {
        operation: 'remove',
        'http.method': 'DELETE',
      },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const { accountId, groupId } = ctx.validated.body;

      await accountGroupService.remove(tenantId, accountId, groupId);

      ctx.status = 204;
    }
  );
};

export const findByAccountId = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findByAccountId`,
      attributes: {
        operation: 'findByAccountId',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, accountId } = ctx.validated.params;

      const accountGroups = await accountGroupService.findByAccountId(
        tenantId,
        accountId
      );

      ctx.body = accountGroupMapper.toListResponse(accountGroups);
    }
  );
};

export const findByGroupId = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findByGroupId`,
      attributes: {
        operation: 'findByGroupId',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, groupId } = ctx.validated.params;

      const groupAccounts = await accountGroupService.findByGroupId(
        tenantId,
        groupId
      );

      ctx.body = accountGroupMapper.toListResponse(groupAccounts);
    }
  );
};

export const updateRoles = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.updateRoles`,
      attributes: {
        operation: 'updateRoles',
        'http.method': 'PUT',
      },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const { accountId, groupId, roles } = ctx.validated.body;

      const accountGroup = await accountGroupService.updateRoles(
        tenantId,
        accountId,
        groupId,
        roles
      );

      ctx.body = accountGroupMapper.toResponse(accountGroup);
    }
  );
};
