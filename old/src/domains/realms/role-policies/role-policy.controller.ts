import * as rolePolicyService from './role-policy.service';
import * as rolePolicyMapper from './role-policy.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'role-policy.controller';

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

      const rolePolicy = await rolePolicyService.create(tenantId, data);

      ctx.status = 201;
      ctx.body = rolePolicyMapper.toResponse(rolePolicy);
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
      const { roleId, policyId } = ctx.validated.body;

      await rolePolicyService.remove(tenantId, roleId, policyId);

      ctx.status = 204;
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

      const rolePolicies = await rolePolicyService.findByRoleId(
        tenantId,
        roleId
      );

      ctx.body = rolePolicyMapper.toListResponse(rolePolicies);
    }
  );
};

export const findByPolicyId = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findByPolicyId`,
      attributes: {
        operation: 'findByPolicyId',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, policyId } = ctx.validated.params;

      const policyRoles = await rolePolicyService.findByPolicyId(
        tenantId,
        policyId
      );

      ctx.body = rolePolicyMapper.toListResponse(policyRoles);
    }
  );
};
