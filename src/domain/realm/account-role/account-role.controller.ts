import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from '@idm-auth/koa-inversify-framework/abstract';
import { Controller } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  Get,
  Post,
  Delete,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from '@idm-auth/koa-inversify-framework/decorator';
import {
  commonErrorResponses,
  RequestParamsIdAndTenantIdSchema,
  RequestParamsTenantIdSchema,
  ContextWithBody,
  ContextWithParams,
  IdWithTenantParam,
} from '@idm-auth/koa-inversify-framework/common';
import {
  AccountRoleService,
  AccountRoleServiceSymbol,
} from '@/domain/realm/account-role/account-role.service';
import {
  AccountRoleMapper,
  AccountRoleMapperSymbol,
} from '@/domain/realm/account-role/account-role.mapper';
import {
  AccountRoleDtoTypes,
  accountRoleCreateSchema,
  accountRoleBaseResponseSchema,
} from '@/domain/realm/account-role/account-role.dto';
import {
  AccountRoleSchema,
  AccountRoleCreate,
} from '@/domain/realm/account-role/account-role.entity';

export const AccountRoleControllerSymbol = Symbol.for('AccountRoleController');

@SwaggerDocController({
  name: 'Account Roles',
  description: 'Account role assignment management',
  tags: ['Account Roles'],
})
@Controller(AccountRoleControllerSymbol, {
  basePath: '/api/realm/:tenantId/account-role',
  multiTenant: true,
})
export class AccountRoleController extends AbstractCrudController<
  AccountRoleSchema,
  AccountRoleDtoTypes,
  AccountRoleCreate
> {
  constructor(
    @inject(AccountRoleServiceSymbol) protected service: AccountRoleService,
    @inject(AccountRoleMapperSymbol) protected mapper: AccountRoleMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Assign role to account',
    tags: ['Account Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Role assigned',
        content: {
          'application/json': {
            schema: accountRoleBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: accountRoleCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<AccountRoleDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List account roles',
    tags: ['Account Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of account roles',
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
    summary: 'Get account role by ID',
    tags: ['Account Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Account role found',
        content: {
          'application/json': {
            schema: accountRoleBaseResponseSchema,
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
    summary: 'Remove role from account',
    tags: ['Account Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Role removed',
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
}
