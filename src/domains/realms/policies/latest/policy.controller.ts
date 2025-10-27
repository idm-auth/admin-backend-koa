import * as policyService from '@/domains/realms/policies/latest/policy.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
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
  ctx.body = {
    id: policy._id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    conditions: policy.conditions,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  const policy = await policyService.findById(tenantId, id);

  ctx.body = {
    id: policy._id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    conditions: policy.conditions,
  };
};

export const update = async (ctx: Context) => {
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

  ctx.body = {
    id: policy._id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    conditions: policy.conditions,
  };
};

export const findAll = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;

  const policies = await policyService.findAll(tenantId);

  ctx.body = policies.map((policy) => ({
    id: policy._id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    conditions: policy.conditions,
  }));
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  await policyService.remove(tenantId, id);

  ctx.status = 204;
};
