import { inject } from 'inversify';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Put, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema } from 'koa-inversify-framework/common';
import { Context } from 'koa';
import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import {
  AccountMapper,
  AccountMapperSymbol,
} from '@/domain/realm/account/account.mapper';
import { AccountDtoTypes, accountCreateSchema, accountUpdateSchema, accountBaseResponseSchema } from '@/domain/realm/account/account.dto';
import { AccountSchema } from '@/domain/realm/account/account.entity';

export const AccountControllerSymbol = Symbol.for('AccountController');

@SwaggerDocController({
  name: 'Accounts',
  description: 'Account management',
  tags: ['Accounts'],
})
@Controller(AccountControllerSymbol, {
  basePath: '/api/realm/:tenantId/accounts',
  multiTenant: true,
})
export class AccountController extends AbstractController<
  AccountSchema,
  AccountDtoTypes
> {
  constructor(
    @inject(AccountServiceSymbol) protected service: AccountService,
    @inject(AccountMapperSymbol) protected mapper: AccountMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.accounts';
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
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: accountCreateSchema })
  @Post('/')
  async create(ctx: Context & { request: { body: { email: string; password: string } } }): Promise<void> {
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
  async findById(ctx: Context & { params: { id: string; tenantId?: string } }): Promise<void> {
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
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema, body: accountUpdateSchema })
  @Put('/:id')
  async update(ctx: Context & { params: { id: string; tenantId?: string }; request: { body: { isActive?: boolean } } }): Promise<void> {
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
  async delete(ctx: Context & { params: { id: string; tenantId?: string } }): Promise<void> {
    return super.delete(ctx);
  }
}
