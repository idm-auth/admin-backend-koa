import * as accountRoleService from './account-role.service';
import * as accountRoleMapper from './account-role.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'account-role.controller';

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

      const accountRole = await accountRoleService.create(tenantId, data);

      ctx.status = 201;
      ctx.body = accountRoleMapper.toResponse(accountRole);
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
      const { accountId, roleId } = ctx.validated.body;

      await accountRoleService.remove(tenantId, accountId, roleId);

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

      const accountRoles = await accountRoleService.findByAccountId(
        tenantId,
        accountId
      );

      ctx.body = accountRoleMapper.toListResponse(accountRoles);
    }
  );
};

export const findByRoleId = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findByRoleId`,
      attributes: {
        operation: 'findByRoleId',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, roleId } = ctx.validated.params;

      const roleAccounts = await accountRoleService.findByRoleId(
        tenantId,
        roleId
      );

      ctx.body = accountRoleMapper.toListResponse(roleAccounts);
    }
  );
};
