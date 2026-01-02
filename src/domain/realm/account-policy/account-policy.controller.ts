import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema, ContextWithBody, ContextWithParams, IdWithTenantParam } from 'koa-inversify-framework/common';
import { AccountPolicyService, AccountPolicyServiceSymbol } from '@/domain/realm/account-policy/account-policy.service';
import { AccountPolicyMapper, AccountPolicyMapperSymbol } from '@/domain/realm/account-policy/account-policy.mapper';
import { AccountPolicyDtoTypes, accountPolicyCreateSchema, accountPolicyBaseResponseSchema } from '@/domain/realm/account-policy/account-policy.dto';
import { AccountPolicySchema, AccountPolicyCreate } from '@/domain/realm/account-policy/account-policy.entity';

export const AccountPolicyControllerSymbol = Symbol.for('AccountPolicyController');

@SwaggerDocController({
  name: 'Account Policies',
  description: 'Account policy assignment management',
  tags: ['Account Policies'],
})
@Controller(AccountPolicyControllerSymbol, {
  basePath: '/api/realm/:tenantId/account-policy',
  multiTenant: true,
})
export class AccountPolicyController extends AbstractCrudController<AccountPolicySchema, AccountPolicyDtoTypes, AccountPolicyCreate> {
  constructor(
    @inject(AccountPolicyServiceSymbol) protected service: AccountPolicyService,
    @inject(AccountPolicyMapperSymbol) protected mapper: AccountPolicyMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.account-policies';
  }

  @SwaggerDoc({
    summary: 'Assign policy to account',
    tags: ['Account Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: accountPolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy assigned',
        content: {
          'application/json': {
            schema: accountPolicyBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: accountPolicyCreateSchema })
  @Post('/')
  async create(ctx: ContextWithBody<AccountPolicyDtoTypes['CreateRequestDto']>): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List account policies',
    tags: ['Account Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of account policies',
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
    summary: 'Get account policy by ID',
    tags: ['Account Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Account policy found',
        content: {
          'application/json': {
            schema: accountPolicyBaseResponseSchema,
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
    summary: 'Remove policy from account',
    tags: ['Account Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy removed',
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
