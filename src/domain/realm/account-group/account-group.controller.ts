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
  AccountGroupService,
  AccountGroupServiceSymbol,
} from '@/domain/realm/account-group/account-group.service';
import {
  AccountGroupMapper,
  AccountGroupMapperSymbol,
} from '@/domain/realm/account-group/account-group.mapper';
import {
  AccountGroupDtoTypes,
  accountGroupCreateSchema,
  accountGroupBaseResponseSchema,
} from '@/domain/realm/account-group/account-group.dto';
import {
  AccountGroupSchema,
  AccountGroupCreate,
} from '@/domain/realm/account-group/account-group.entity';

export const AccountGroupControllerSymbol = Symbol.for(
  'AccountGroupController'
);

@SwaggerDocController({
  name: 'Account Groups',
  description: 'Account group assignment management',
  tags: ['Account Groups'],
})
@Controller(AccountGroupControllerSymbol, {
  basePath: '/api/realm/:tenantId/account-group',
  multiTenant: true,
})
export class AccountGroupController extends AbstractCrudController<
  AccountGroupSchema,
  AccountGroupDtoTypes,
  AccountGroupCreate
> {
  constructor(
    @inject(AccountGroupServiceSymbol) protected service: AccountGroupService,
    @inject(AccountGroupMapperSymbol) protected mapper: AccountGroupMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Assign group to account',
    tags: ['Account Groups'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountGroupCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Group assigned',
        content: {
          'application/json': {
            schema: accountGroupBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: accountGroupCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<AccountGroupDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List account groups',
    tags: ['Account Groups'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of account groups',
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
    summary: 'Get account group by ID',
    tags: ['Account Groups'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Account group found',
        content: {
          'application/json': {
            schema: accountGroupBaseResponseSchema,
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
    summary: 'Remove group from account',
    tags: ['Account Groups'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Group removed',
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
