import * as accountService from './account.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { email, password } = ctx.validated.body;

  const account = await accountService.create(tenantId, {
    email,
    password,
  });

  ctx.status = 201;
  ctx.body = {
    _id: account._id.toString(),
    email: account.emails[0]?.email,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  const account = await accountService.findById(tenantId, { id });

  ctx.body = {
    _id: account._id.toString(),
    email: account.emails[0]?.email,
  };
};

export const findByEmail = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;
  const { email } = ctx.validated.query;

  const account = await accountService.findByEmail(tenantId, {
    email,
  });

  ctx.body = {
    _id: account._id.toString(),
    email: account.emails[0]?.email,
  };
};

export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;
  const { email, password } = ctx.validated.body;

  const account = await accountService.update(tenantId, {
    id,
    emails: email ? [{ email, isPrimary: true }] : undefined,
    password,
  });

  ctx.body = {
    _id: account._id.toString(),
    email: account.emails[0]?.email,
  };
};

export const findAll = async (ctx: Context) => {
  const { tenantId } = ctx.validated.params;

  const accounts = await accountService.findAll(tenantId);

  ctx.body = accounts.map((account) => ({
    _id: account._id.toString(),
    email: account.emails[0]?.email,
  }));
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.validated.params;

  await accountService.remove(tenantId, { id });

  ctx.status = 204;
};
