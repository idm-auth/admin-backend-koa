import * as groupRoleService from './group-role.service';
import { Context } from 'koa';

export const addRoleToGroup = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { groupId, roleId } = ctx.request.body;

  const groupRole = await groupRoleService.addRoleToGroup(tenantId, {
    groupId,
    roleId,
  });

  ctx.status = 201;
  ctx.body = {
    id: groupRole._id,
    groupId: groupRole.groupId,
    roleId: groupRole.roleId,
  };
};

export const removeRoleFromGroup = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { groupId, roleId } = ctx.request.body;

  await groupRoleService.removeRoleFromGroup(tenantId, {
    groupId,
    roleId,
  });

  ctx.status = 204;
};

export const getGroupRoles = async (ctx: Context) => {
  const { tenantId, groupId } = ctx.params;

  const groupRoles = await groupRoleService.getGroupRoles(tenantId, {
    groupId,
  });

  ctx.body = groupRoles.map((gr) => ({
    id: gr._id,
    groupId: gr.groupId,
    roleId: gr.roleId,
  }));
};

export const getRoleGroups = async (ctx: Context) => {
  const { tenantId, roleId } = ctx.params;

  const roleGroups = await groupRoleService.getRoleGroups(tenantId, {
    roleId,
  });

  ctx.body = roleGroups.map((rg) => ({
    id: rg._id,
    groupId: rg.groupId,
    roleId: rg.roleId,
  }));
};