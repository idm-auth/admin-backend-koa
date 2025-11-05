import * as groupService from '@/domains/realms/groups/latest/group.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { name, description } = ctx.validated.body;

  const group = await groupService.create(tenantId, {
    name,
    description,
  });

  ctx.status = 201;
  ctx.body = {
    id: group._id,
    name: group.name,
    description: group.description,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  const group = await groupService.findById(tenantId, id);

  ctx.body = {
    id: group._id,
    name: group.name,
    description: group.description,
  };
};

export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const { name, description } = ctx.validated.body;

  const group = await groupService.update(tenantId, id, {
    name,
    description,
  });

  ctx.body = {
    id: group._id,
    name: group.name,
    description: group.description,
  };
};



export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  await groupService.remove(tenantId, id);

  ctx.status = 204;
};
