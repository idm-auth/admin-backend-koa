import { withSpanAsync } from '@/utils/tracing.util';
import { Context } from 'koa';
import * as groupRoleMapper from './group-role.mapper';
import * as groupRoleService from './group-role.service';

const CONTROLLER_NAME = 'group-role.controller';

export const addRoleToGroup = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.addRoleToGroup`,
      attributes: {
        operation: 'addRoleToGroup',
        'http.method': 'POST',
      },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const { groupId, roleId } = ctx.validated.body;

      const groupRole = await groupRoleService.addRoleToGroup(tenantId, {
        groupId,
        roleId,
      });

      ctx.status = 201;
      ctx.body = groupRoleMapper.toResponse(groupRole);
    }
  );
};

export const removeRoleFromGroup = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.removeRoleFromGroup`,
      attributes: {
        operation: 'removeRoleFromGroup',
        'http.method': 'DELETE',
      },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const { groupId, roleId } = ctx.validated.body;

      await groupRoleService.removeRoleFromGroup(tenantId, {
        groupId,
        roleId,
      });

      ctx.status = 204;
    }
  );
};

export const getGroupRoles = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.getGroupRoles`,
      attributes: {
        operation: 'getGroupRoles',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, groupId } = ctx.validated.params;

      const groupRoles = await groupRoleService.getGroupRoles(tenantId, {
        groupId,
      });

      ctx.body = groupRoleMapper.toListResponse(groupRoles);
    }
  );
};

export const getRoleGroups = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.getRoleGroups`,
      attributes: {
        operation: 'getRoleGroups',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, roleId } = ctx.validated.params;

      const roleGroups = await groupRoleService.getRoleGroups(tenantId, {
        roleId,
      });

      ctx.body = groupRoleMapper.toListResponse(roleGroups);
    }
  );
};
