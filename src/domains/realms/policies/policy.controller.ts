import { withSpanAsync } from '@/utils/tracing.util';
import { Context } from 'koa';
import * as policyMapper from './policy.mapper';
import * as policyService from './policy.service';

const CONTROLLER_NAME = 'policy.controller';

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
      const { name, description, effect, actions, resources, conditions } =
        ctx.validated.body;

      const policy = await policyService.create(tenantId, {
        name,
        description,
        effect,
        actions,
        resources,
        conditions,
      });

      ctx.status = 201;
      ctx.body = policyMapper.toResponse(policy);
    }
  );
};

export const findById = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.findById`,
      attributes: {
        operation: 'findById',
        'http.method': 'GET',
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      const policy = await policyService.findById(tenantId, id);

      ctx.body = policyMapper.toResponse(policy);
    }
  );
};

export const update = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.update`,
      attributes: {
        operation: 'update',
        'http.method': 'PUT',
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;
      const { name, description, effect, actions, resources, conditions } =
        ctx.validated.body;

      const policy = await policyService.update(tenantId, id, {
        name,
        description,
        effect,
        actions,
        resources,
        conditions,
      });

      ctx.body = policyMapper.toResponse(policy);
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
      const { tenantId, id } = ctx.validated.params;

      await policyService.remove(tenantId, id);

      ctx.status = 204;
    }
  );
};
