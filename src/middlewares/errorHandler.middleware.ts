import { Context, Next } from 'koa';
import { getLogger } from '@/utils/localStorage.util';
import { ValidationError } from '@/errors/validation';
import { NotFoundError } from '@/errors/not-found';
import { ConflictError } from '@/errors/conflict';
import { ZodError } from 'zod';

export const errorHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error: unknown) {
    const logger = await getLogger();

    if (error instanceof ZodError) {
      const messages = error.issues.map((issue) => issue.message).join(', ');
      logger.warn({ zodError: error.issues }, 'Zod validation error');
      ctx.status = 400;
      ctx.body = {
        error: 'Validation failed',
        details: messages,
        fields: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      };
    } else if (error instanceof ValidationError) {
      logger.warn({ message: error.message }, 'Custom validation error');
      ctx.status = 400;
      ctx.body = { error: error.message };
    } else if (error instanceof NotFoundError) {
      logger.warn({ message: error.message }, 'Resource not found');
      ctx.status = 404;
      ctx.body = { error: error.message };
    } else if (error instanceof ConflictError) {
      logger.warn({ message: error.message }, 'Resource conflict');
      ctx.status = 409;
      ctx.body = {
        error: error.message,
        field: error.field,
        details: error.details,
      };
    } else if (
      error instanceof Error &&
      'code' in error &&
      error.code === 11000
    ) {
      logger.warn({ message: error.message }, 'Duplicate key error');

      // Extract field name from MongoDB duplicate key error
      const duplicateField =
        error.message.match(/dup key: \{ (\w+):/)?.[1] || 'field';

      ctx.status = 409;
      ctx.body = {
        error: 'Resource already exists',
        field: duplicateField,
        details: `A resource with this ${duplicateField} already exists`,
      };
    } else if (error instanceof Error) {
      logger.error(error, 'Unhandled error');
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    } else {
      logger.error({ error }, 'Unknown error type');
      ctx.status = 500;
      ctx.body = { error: 'Internal server error' };
    }
  }
};
