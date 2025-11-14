import * as roleService from './role.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { name, description, permissions } = ctx.validated.body;

  const role = await roleService.create(tenantId, {
    name,
    description,
    permissions,
  });

  ctx.status = 201;
  ctx.body = {
    id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  const role = await roleService.findById(tenantId, id);

  ctx.body = {
    id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
};

export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const { name, description, permissions } = ctx.validated.body;

  const role = await roleService.update(tenantId, id, {
    name,
    description,
    permissions,
  });

  ctx.body = {
    id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  await roleService.remove(tenantId, id);

  ctx.status = 204;
};
