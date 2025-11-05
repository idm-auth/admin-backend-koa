import * as accountGroupService from '@/domains/realms/account-groups/latest/account-group.service';
import { Context } from 'koa';

export const addAccountToGroup = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { accountId, groupId, roles } = ctx.validated.body;

  const accountGroup = await accountGroupService.addAccountToGroup(tenantId, {
    accountId,
    groupId,
    roles,
  });

  ctx.status = 201;
  ctx.body = {
    id: accountGroup._id,
    accountId: accountGroup.accountId,
    groupId: accountGroup.groupId,
    roles: accountGroup.roles,
  };
};

export const removeAccountFromGroup = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { accountId, groupId } = ctx.validated.body;

  await accountGroupService.removeAccountFromGroup(tenantId, {
    accountId,
    groupId,
  });

  ctx.status = 204;
};

export const getAccountGroups = async (ctx: Context) => {
  const { tenantId, accountId } = ctx.validated.params;

  const accountGroups = await accountGroupService.getAccountGroups(tenantId, {
    accountId,
  });

  ctx.body = accountGroups.map((ag) => ({
    id: ag._id,
    accountId: ag.accountId,
    groupId: ag.groupId,
    roles: ag.roles,
  }));
};

export const getGroupAccounts = async (ctx: Context) => {
  const { tenantId, groupId } = ctx.validated.params;

  const groupAccounts = await accountGroupService.getGroupAccounts(tenantId, {
    groupId,
  });

  ctx.body = groupAccounts.map((ga) => ({
    id: ga._id,
    accountId: ga.accountId,
    groupId: ga.groupId,
    roles: ga.roles,
  }));
};



export const updateAccountGroupRoles = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { accountId, groupId, roles } = ctx.validated.body;

  const accountGroup = await accountGroupService.updateAccountGroupRoles(
    tenantId,
    {
      accountId,
      groupId,
      roles,
    }
  );

  ctx.body = {
    id: accountGroup._id,
    accountId: accountGroup.accountId,
    groupId: accountGroup.groupId,
    roles: accountGroup.roles,
  };
};
