import * as realmService from './realm.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { name, dbName, jwtConfig } = ctx.request.body;

  const realm = await realmService.create({
    data: { name, dbName, jwtConfig },
  });

  ctx.status = 201;
  ctx.body = {
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.params;

  const realm = await realmService.findById({ id });

  ctx.body = {
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findByPublicUUID = async (ctx: Context) => {
  const { publicUUID } = ctx.params;

  const realm = await realmService.findByPublicUUID({
    publicUUID,
  });

  ctx.body = {
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findByName = async (ctx: Context) => {
  const { name } = ctx.query;

  const realm = await realmService.findByName({ name: name as string });

  ctx.body = {
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const update = async (ctx: Context) => {
  const { id } = ctx.params;
  const updateData = ctx.request.body;

  const realm = await realmService.update({ id, data: updateData });

  ctx.body = {
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  };
};

export const findAll = async (ctx: Context) => {
  const realms = await realmService.findAll();

  ctx.body = realms.map((realm) => ({
    id: realm._id,
    name: realm.name,
    publicUUID: realm.publicUUID,
    dbName: realm.dbName,
  }));
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.params;

  await realmService.remove({ id });

  ctx.status = 204;
};
