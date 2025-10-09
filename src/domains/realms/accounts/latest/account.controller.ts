import { emailSchema } from '@/domains/commons/base/v1/base.schema';
import * as accountService from './account.service';
import { validateZod } from '@/domains/commons/validations/v1/validation.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { email, password } = ctx.request.body;

  const account = await accountService.create(tenantId, {
    email,
    password,
  });

  ctx.status = 201;
  ctx.body = {
    id: account._id,
    email: account.emails[0]?.email,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;

  const account = await accountService.findById(tenantId, { id });

  ctx.body = {
    id: account._id,
    email: account.emails[0]?.email,
  };
};

export const findByEmail = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { email } = ctx.query;

  const validEmail = await validateZod(email, emailSchema);
  const account = await accountService.findByEmail(tenantId, {
    email: validEmail,
  });

  ctx.body = {
    id: account._id,
    email: account.emails[0]?.email,
  };
};

export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;
  const { email, password } = ctx.request.body;

  const account = await accountService.update(tenantId, {
    id,
    emails: email ? [{ email, isPrimary: true }] : undefined,
    password,
  });

  ctx.body = {
    id: account._id,
    email: account.emails[0]?.email,
  };
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;

  await accountService.remove(tenantId, { id });

  ctx.status = 204;
};
