import * as accountPolicyService from './account-policy.service';
import * as accountPolicyMapper from './account-policy.mapper';
import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';

const CONTROLLER_NAME = 'account-policy.controller';

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

      const accountPolicy = await accountPolicyService.create(tenantId, data);

      ctx.status = 201;
      ctx.body = accountPolicyMapper.toResponse(accountPolicy);
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
      const { accountId, policyId } = ctx.validated.body;

      await accountPolicyService.remove(tenantId, accountId, policyId);

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

      const accountPolicies = await accountPolicyService.findByAccountId(
        tenantId,
        accountId
      );

      ctx.body = accountPolicyMapper.toListResponse(accountPolicies);
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

      const policyAccounts = await accountPolicyService.findByPolicyId(
        tenantId,
        policyId
      );

      ctx.body = accountPolicyMapper.toListResponse(policyAccounts);
    }
  );
};
