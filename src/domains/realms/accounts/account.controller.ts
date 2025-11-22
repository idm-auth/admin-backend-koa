import { getLogger } from '@/utils/localStorage.util';
import { withSpanAsync } from '@/utils/tracing.util';
import { Context } from 'koa';
import * as accountMapper from './account.mapper';
import { AccountPaginatedResponse } from './account.schema';
import * as accountService from './account.service';

const CONTROLLER_NAME = 'account';

export const create = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.create`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.email': ctx.validated.body?.email,
        'http.method': 'POST',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;

      logger.debug(
        { tenantId, body: ctx.validated.body },
        'Try create new account'
      );

      const account = await accountService.create(tenantId, ctx.validated.body);
      const response = accountMapper.toCreateResponse(account);

      logger.info(
        { tenantId, accountId: account._id },
        'Account created successfully'
      );

      ctx.status = 201;
      ctx.body = response;
    }
  );
};

export const findById = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findById`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'http.method': 'GET',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const { tenantId, id } = ctx.validated.params;

      const account = await accountService.findById(tenantId, id);
      const response = accountMapper.toCreateResponse(account);

      ctx.body = response;
    }
  );
};

export const update = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.update`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'http.method': 'PUT',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const updateData = ctx.validated.body;

      const account = await accountService.update(tenantId, id, updateData);

      logger.info({ tenantId, accountId: id }, 'Account updated successfully');

      ctx.body = accountMapper.toUpdateResponse(account);
    }
  );
};

export const findAllPaginated = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.findAllPaginated`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'http.method': 'GET',
        controller: CONTROLLER_NAME,
        operation: 'findAllPaginated',
      },
    },
    async (span) => {
      const logger = await getLogger();
      const { tenantId } = ctx.validated.params;
      const query = ctx.validated.query;

      logger.debug({ tenantId, query }, 'Finding paginated accounts');

      const serviceResult = await accountService.findAllPaginated(
        tenantId,
        query
      );

      const data = serviceResult.data.map(accountMapper.toListItemResponse);

      const result: AccountPaginatedResponse = {
        data,
        pagination: serviceResult.pagination,
      };

      span.setAttributes({
        'result.total': serviceResult.pagination.total,
        'result.page': serviceResult.pagination.page,
        'result.totalPages': serviceResult.pagination.totalPages,
      });

      logger.debug(
        { tenantId, total: serviceResult.pagination.total },
        'Retrieved paginated accounts'
      );

      ctx.body = result;
    }
  );
};

export const remove = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.remove`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'http.method': 'DELETE',
        controller: CONTROLLER_NAME,
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;

      await accountService.remove(tenantId, id);

      logger.info({ tenantId, accountId: id }, 'Account removed successfully');

      ctx.status = 204;
    }
  );
};

export const resetPassword = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.resetPassword`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'http.method': 'PATCH',
        controller: CONTROLLER_NAME,
        operation: 'resetPassword',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const { password } = ctx.validated.body;

      const account = await accountService.resetPassword(
        tenantId,
        id,
        password
      );

      logger.info(
        { tenantId, accountId: id },
        'Account password reset successfully'
      );

      ctx.body = accountMapper.toUpdateResponse(account);
    }
  );
};

export const updatePassword = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.updatePassword`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'http.method': 'PATCH',
        controller: CONTROLLER_NAME,
        operation: 'updatePassword',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const { currentPassword, newPassword } = ctx.validated.body;

      const account = await accountService.updatePassword(
        tenantId,
        id,
        currentPassword,
        newPassword
      );

      logger.info(
        { tenantId, accountId: id },
        'Account password updated successfully'
      );

      ctx.body = accountMapper.toUpdateResponse(account);
    }
  );
};

export const addEmail = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.addEmail`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'account.email': ctx.validated.body?.email,
        'http.method': 'POST',
        controller: CONTROLLER_NAME,
        operation: 'addEmail',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const { email } = ctx.validated.body;

      const account = await accountService.addEmail(tenantId, id, email);

      logger.info(
        { tenantId, accountId: id, email },
        'Email added to account successfully'
      );

      ctx.body = accountMapper.toUpdateResponse(account);
    }
  );
};

export const removeEmail = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.removeEmail`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'account.email': ctx.validated.body?.email,
        'http.method': 'POST',
        controller: CONTROLLER_NAME,
        operation: 'removeEmail',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const { email } = ctx.validated.body;

      try {
        const account = await accountService.removeEmail(tenantId, id, email);

        logger.info(
          { tenantId, accountId: id, email },
          'Email removed from account successfully'
        );

        ctx.body = accountMapper.toUpdateResponse(account);
      } catch (error) {
        logger.error(
          { error, tenantId, accountId: id, email },
          'Failed to remove email from account'
        );
        throw error;
      }
    }
  );
};

export const setPrimaryEmail = async (ctx: Context) => {
  return withSpanAsync(
    {
      name: `${CONTROLLER_NAME}.controller.setPrimaryEmail`,
      attributes: {
        'tenant.id': ctx.validated.params.tenantId,
        'account.id': ctx.validated.params.id,
        'account.email': ctx.validated.body?.email,
        'http.method': 'PATCH',
        controller: CONTROLLER_NAME,
        operation: 'setPrimaryEmail',
      },
    },
    async () => {
      const logger = await getLogger();
      const { tenantId, id } = ctx.validated.params;
      const { email } = ctx.validated.body;

      try {
        const account = await accountService.setPrimaryEmail(
          tenantId,
          id,
          email
        );

        logger.info(
          { tenantId, accountId: id, email },
          'Primary email set successfully'
        );

        ctx.body = accountMapper.toUpdateResponse(account);
      } catch (error) {
        logger.error(
          { error, tenantId, accountId: id, email },
          'Failed to set primary email'
        );
        throw error;
      }
    }
  );
};
