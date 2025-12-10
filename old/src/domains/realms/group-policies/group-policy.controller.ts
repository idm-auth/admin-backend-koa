import * as groupPolicyService from './group-policy.service';
import * as groupPolicyMapper from './group-policy.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'group-policy.controller';

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

      const groupPolicy = await groupPolicyService.create(tenantId, data);

      ctx.status = 201;
      ctx.body = groupPolicyMapper.toResponse(groupPolicy);
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
      const { groupId, policyId } = ctx.validated.body;

      await groupPolicyService.remove(tenantId, groupId, policyId);

      ctx.status = 204;
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

      const groupPolicies = await groupPolicyService.findByGroupId(
        tenantId,
        groupId
      );

      ctx.body = groupPolicyMapper.toListResponse(groupPolicies);
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

      const policyGroups = await groupPolicyService.findByPolicyId(
        tenantId,
        policyId
      );

      ctx.body = groupPolicyMapper.toListResponse(policyGroups);
    }
  );
};
