import * as accountRoleService from './account-role.service';
import { Context } from 'koa';

export const addRoleToAccount = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { accountId, roleId } = ctx.request.body;

  const accountRole = await accountRoleService.addRoleToAccount(tenantId, {
    accountId,
    roleId,
  });

  ctx.status = 201;
  ctx.body = {
    id: accountRole._id,
    accountId: accountRole.accountId,
    roleId: accountRole.roleId,
  };
};

export const removeRoleFromAccount = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { accountId, roleId } = ctx.request.body;

  await accountRoleService.removeRoleFromAccount(tenantId, {
    accountId,
    roleId,
  });

  ctx.status = 204;
};

export const getAccountRoles = async (ctx: Context) => {
  const { tenantId, accountId } = ctx.params;

  const accountRoles = await accountRoleService.getAccountRoles(tenantId, {
    accountId,
  });

  ctx.body = accountRoles.map((ar) => ({
    id: ar._id,
    accountId: ar.accountId,
    roleId: ar.roleId,
  }));
};

export const getRoleAccounts = async (ctx: Context) => {
  const { tenantId, roleId } = ctx.params;

  const roleAccounts = await accountRoleService.getRoleAccounts(tenantId, {
    roleId,
  });

  ctx.body = roleAccounts.map((ra) => ({
    id: ra._id,
    accountId: ra.accountId,
    roleId: ra.roleId,
  }));
};