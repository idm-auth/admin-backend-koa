import { emailSchema } from '@/schemas/v1/base.schema';
import * as userService from '@/services/v1/user.service';
import { validateZod } from '@/services/v1/validation.service';
import { Context } from 'koa';

export const create = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { email, password } = ctx.request.body;

  const user = await userService.create(tenantId, {
    email,
    password,
  });

  ctx.status = 201;
  ctx.body = {
    id: user._id,
    email: user.emails[0]?.email,
  };
};

export const findById = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;

  const user = await userService.findById(tenantId, { id });

  ctx.body = {
    id: user._id,
    email: user.emails[0]?.email,
  };
};

export const findByEmail = async (ctx: Context) => {
  const { tenantId } = ctx.params;
  const { email } = ctx.query;

  const validEmail = await validateZod(email, emailSchema);
  const user = await userService.findByEmail(tenantId, {
    email: validEmail,
  });

  ctx.body = {
    id: user._id,
    email: user.emails[0]?.email,
  };
};

export const update = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;
  const { email, password } = ctx.request.body;

  const user = await userService.update(tenantId, {
    id,
    emails: email ? [{ email, isPrimary: true }] : undefined,
    password,
  });

  ctx.body = {
    id: user._id,
    email: user.emails[0]?.email,
  };
};

export const remove = async (ctx: Context) => {
  const { tenantId, id } = ctx.params;

  await userService.remove(tenantId, { id });

  ctx.status = 204;
};
