import { Context } from 'koa';
import userService from '@/services/latest/user.service';
import { getLogger } from '@/utils/localStorage.util';
import { ValidationError } from '@/errors/validation';

const create = async (ctx: Context) => {
  const logger = getLogger();
  try {
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
  } catch (error: unknown) {
    logger.error(error, 'Error creating user');
    if (error instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    } else {
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
};

const findById = async (ctx: Context) => {
  const logger = getLogger();
  try {
    const { tenantId, id } = ctx.params;

    const user = await userService.findById(tenantId, { id });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.body = {
      id: user._id,
      email: user.emails[0]?.email,
    };
  } catch (error: unknown) {
    logger.error(error, 'Error finding user');
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

const findByEmail = async (ctx: Context) => {
  const logger = getLogger();
  try {
    const { tenantId } = ctx.params;
    const { email } = ctx.query;

    const user = await userService.findByEmail(tenantId, {
      email: email as string,
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.body = {
      id: user._id,
      email: user.emails[0]?.email,
    };
  } catch (error: unknown) {
    logger.error(error, 'Error finding user by email');
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

const update = async (ctx: Context) => {
  const logger = getLogger();
  try {
    const { tenantId, id } = ctx.params;
    const { email, password } = ctx.request.body;

    const user = await userService.update(tenantId, {
      id,
      emails: email ? [{ email, isPrimary: true }] : undefined,
      password,
    });
    if (!user) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.body = {
      id: user._id,
      email: user.emails[0]?.email,
    };
  } catch (error: unknown) {
    logger.error(error, 'Error updating user');
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

const remove = async (ctx: Context) => {
  const logger = getLogger();
  try {
    const { tenantId, id } = ctx.params;

    const success = await userService.remove(tenantId, { id });
    if (!success) {
      ctx.status = 404;
      ctx.body = { error: 'User not found' };
      return;
    }
    ctx.status = 204;
  } catch (error: unknown) {
    logger.error(error, 'Error removing user');
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
};

export default { create, findById, findByEmail, update, remove };
