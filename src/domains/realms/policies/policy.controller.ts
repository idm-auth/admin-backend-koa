import { Context } from 'koa';
import { withSpanAsync } from '@/utils/tracing.util';
import * as policyService from './policy.service';
import * as policyMapper from './policy.mapper';
import { PolicyCreate, PolicyUpdate, PolicyListQuery } from './policy.schema';
import { RequestTenantIdAndIdParams } from '@/domains/commons/base/request.schema';

const CONTROLLER_NAME = 'policy.controller';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.create`,
      attributes: { operation: 'create', 'http.method': 'POST' },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const data: PolicyCreate = ctx.validated.body;

      const policy = await policyService.create(tenantId, data);
      const response = policyMapper.toCreateResponse(policy);

      ctx.status = 201;
      ctx.body = response;
    }
  );
};

export const findById = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findById`,
      attributes: { operation: 'findById', 'http.method': 'GET' },
    },
    async () => {
      const { tenantId, id }: RequestTenantIdAndIdParams = ctx.validated.params;

      const policy = await policyService.findById(tenantId, id);
      const response = policyMapper.toReadResponse(policy);

      ctx.status = 200;
      ctx.body = response;
    }
  );
};

export const update = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.update`,
      attributes: { operation: 'update', 'http.method': 'PATCH' },
    },
    async () => {
      const { tenantId, id }: RequestTenantIdAndIdParams = ctx.validated.params;
      const data: PolicyUpdate = ctx.validated.body;

      const policy = await policyService.update(tenantId, id, data);
      const response = policyMapper.toUpdateResponse(policy);

      ctx.status = 200;
      ctx.body = response;
    }
  );
};

export const remove = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.remove`,
      attributes: { operation: 'remove', 'http.method': 'DELETE' },
    },
    async () => {
      const { tenantId, id }: RequestTenantIdAndIdParams = ctx.validated.params;

      await policyService.remove(tenantId, id);

      ctx.status = 204;
    }
  );
};

export const list = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.list`,
      attributes: { operation: 'list', 'http.method': 'GET' },
    },
    async () => {
      const { tenantId } = ctx.validated.params;
      const { page, limit }: PolicyListQuery = ctx.validated.query;

      const result = await policyService.list(tenantId, page, limit);
      const response = {
        data: result.data.map(policyMapper.toListItemResponse),
        pagination: result.pagination,
      };

      ctx.status = 200;
      ctx.body = response;
    }
  );
};
