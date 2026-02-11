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
  PolicyActionService,
  PolicyActionServiceSymbol,
} from '@/domain/realm/policy-action/policy-action.service';
import {
  PolicyActionMapper,
  PolicyActionMapperSymbol,
} from '@/domain/realm/policy-action/policy-action.mapper';
import {
  PolicyActionDtoTypes,
  policyActionCreateSchema,
  policyActionBaseResponseSchema,
} from '@/domain/realm/policy-action/policy-action.dto';
import {
  PolicyActionSchema,
  PolicyActionCreate,
} from '@/domain/realm/policy-action/policy-action.entity';

export const PolicyActionControllerSymbol = Symbol.for(
  'PolicyActionController'
);

@SwaggerDocController({
  name: 'Policy Actions',
  description: 'Policy action management',
  tags: ['Policy Actions'],
})
@Controller(PolicyActionControllerSymbol, {
  basePath: '/api/realm/:tenantId/policy-action',
  multiTenant: true,
})
export class PolicyActionController extends AbstractCrudController<
  PolicyActionSchema,
  PolicyActionDtoTypes,
  PolicyActionCreate
> {
  constructor(
    @inject(PolicyActionServiceSymbol) protected service: PolicyActionService,
    @inject(PolicyActionMapperSymbol) protected mapper: PolicyActionMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Create policy action',
    tags: ['Policy Actions'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: policyActionCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy action created',
        content: {
          'application/json': {
            schema: policyActionBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: policyActionCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<PolicyActionDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List policy actions',
    tags: ['Policy Actions'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of policy actions',
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
    summary: 'Get policy action by ID',
    tags: ['Policy Actions'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy action found',
        content: {
          'application/json': {
            schema: policyActionBaseResponseSchema,
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
    summary: 'Delete policy action',
    tags: ['Policy Actions'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy action deleted',
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
