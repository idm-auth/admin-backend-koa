import * as roleService from '@/domains/realms/roles/latest/role.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { name, description, permissions } = ctx.request.body;

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
  const { tenantId, id } = ctx.params;

  const role = await roleService.findById(tenantId, { id });

  ctx.body = {
    id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  };
};



export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;
  const { name, description, permissions } = ctx.request.body;

  const role = await roleService.update(tenantId, {
    id,
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

export const findAll = async (ctx: Context) => {
  const { tenantId } = ctx.params;

  const roles = await roleService.findAll(tenantId);

  ctx.body = roles.map((role) => ({
    id: role._id,
    name: role.name,
    description: role.description,
    permissions: role.permissions,
  }));
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;

  await roleService.remove(tenantId, { id });

  ctx.status = 204;
};
