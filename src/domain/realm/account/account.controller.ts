import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  Get,
  Post,
  Put,
  Delete,
  Patch,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import {
  commonErrorResponses,
  RequestParamsIdAndTenantIdSchema,
  RequestParamsTenantIdSchema,
  ContextWithBody,
  ContextWithParams,
  ContextWithParamsAndBody,
  IdWithTenantParam,
} from 'koa-inversify-framework/common';
import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import {
  AccountMapper,
  AccountMapperSymbol,
} from '@/domain/realm/account/account.mapper';
import {
  AccountDtoTypes,
  accountCreateSchema,
  accountUpdateSchema,
  accountBaseResponseSchema,
  accountResetPasswordSchema,
  accountUpdatePasswordSchema,
  accountAddEmailSchema,
  accountRemoveEmailSchema,
  accountSetPrimaryEmailSchema,
  accountSetActiveStatusSchema,
} from '@/domain/realm/account/account.dto';
import {
  AccountCreate,
  AccountSchema,
} from '@/domain/realm/account/account.entity';

export const AccountControllerSymbol = Symbol.for('AccountController');

@SwaggerDocController({
  name: 'Accounts',
  description: 'Account management',
  tags: ['Accounts'],
})
@Controller(AccountControllerSymbol, {
  basePath: '/api/realm/:tenantId/account',
  multiTenant: true,
})
export class AccountController extends AbstractCrudController<
  AccountSchema,
  AccountDtoTypes,
  AccountCreate
> {
  constructor(
    @inject(AccountServiceSymbol) protected service: AccountService,
    @inject(AccountMapperSymbol) protected mapper: AccountMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Create account',
    description: 'Creates a new account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account created successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      409: commonErrorResponses[409],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: accountCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<AccountDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List accounts',
    description: 'Returns paginated list of accounts',
    tags: ['Accounts'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of accounts',
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema })
  @Get('/')
  async findAllPaginated(ctx: Context): Promise<void> {
    return super.findAllPaginated(ctx);
  }

  @SwaggerDoc({
    summary: 'Get account by ID',
    description: 'Returns a single account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Account found',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema })
  @Get('/:id')
  async findById(ctx: ContextWithParams<IdWithTenantParam>): Promise<void> {
    return super.findById(ctx);
  }

  @SwaggerDoc({
    summary: 'Update account',
    description: 'Updates an existing account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Account updated successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      409: commonErrorResponses[409],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountUpdateSchema,
  })
  @Put('/:id')
  async update(
    ctx: ContextWithParamsAndBody<
      IdWithTenantParam,
      AccountDtoTypes['UpdateRequestDto']
    >
  ): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete account',
    description: 'Deletes an account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Account deleted successfully',
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema })
  @Delete('/:id')
  async delete(ctx: ContextWithParams<IdWithTenantParam>): Promise<void> {
    return super.delete(ctx);
  }

  @SwaggerDoc({
    summary: 'Reset account password',
    description: 'Resets account password (admin operation)',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountResetPasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password reset successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountResetPasswordSchema,
  })
  @Patch('/:id/reset-password')
  async resetPassword(
    ctx: ContextWithParamsAndBody<IdWithTenantParam, { password: string }>
  ): Promise<void> {
    const { id } = ctx.params;
    const { password } = ctx.request.body;
    const account = await this.service.resetPassword(id, password);
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }

  @SwaggerDoc({
    summary: 'Update account password',
    description: 'Updates account password (user operation)',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountUpdatePasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Password updated successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountUpdatePasswordSchema,
  })
  @Patch('/:id/update-password')
  async updatePassword(
    ctx: ContextWithParamsAndBody<
      IdWithTenantParam,
      { currentPassword: string; newPassword: string }
    >
  ): Promise<void> {
    const { id } = ctx.params;
    const { currentPassword, newPassword } = ctx.request.body;
    const account = await this.service.updatePassword(
      id,
      currentPassword,
      newPassword
    );
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }

  @SwaggerDoc({
    summary: 'Add email to account',
    description: 'Adds a new email to account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountAddEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Email added successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      409: commonErrorResponses[409],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountAddEmailSchema,
  })
  @Post('/:id/email')
  async addEmail(
    ctx: ContextWithParamsAndBody<IdWithTenantParam, { email: string }>
  ): Promise<void> {
    const { id } = ctx.params;
    const { email } = ctx.request.body;
    const account = await this.service.addEmail(id, email);
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }

  @SwaggerDoc({
    summary: 'Remove email from account',
    description: 'Removes an email from account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountRemoveEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Email removed successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountRemoveEmailSchema,
  })
  @Post('/:id/email/remove')
  async removeEmail(
    ctx: ContextWithParamsAndBody<IdWithTenantParam, { email: string }>
  ): Promise<void> {
    const { id } = ctx.params;
    const { email } = ctx.request.body;
    const account = await this.service.removeEmail(id, email);
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }

  @SwaggerDoc({
    summary: 'Set primary email',
    description: 'Sets an email as primary',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountSetPrimaryEmailSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Primary email set successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountSetPrimaryEmailSchema,
  })
  @Patch('/:id/email/primary')
  async setPrimaryEmail(
    ctx: ContextWithParamsAndBody<IdWithTenantParam, { email: string }>
  ): Promise<void> {
    const { id } = ctx.params;
    const { email } = ctx.request.body;
    const account = await this.service.setPrimaryEmail(id, email);
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }

  @SwaggerDoc({
    summary: 'Set account active status',
    description: 'Activates or deactivates an account',
    tags: ['Accounts'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountSetActiveStatusSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Active status set successfully',
        content: {
          'application/json': {
            schema: accountBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: accountSetActiveStatusSchema,
  })
  @Patch('/:id/active-status')
  async setActiveStatus(
    ctx: ContextWithParamsAndBody<IdWithTenantParam, { isActive: boolean }>
  ): Promise<void> {
    const { id } = ctx.params;
    const { isActive } = ctx.request.body;
    const account = await this.service.setActiveStatus(id, isActive);
    ctx.body = this.mapper.toUpdateResponseDto(account);
  }
}
