import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Put, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema, ContextWithBody, ContextWithParams, ContextWithParamsAndBody, IdWithTenantParam } from 'koa-inversify-framework/common';
import { PolicyService, PolicyServiceSymbol } from '@/domain/realm/policy/policy.service';
import { PolicyMapper, PolicyMapperSymbol } from '@/domain/realm/policy/policy.mapper';
import { PolicyDtoTypes, policyCreateSchema, policyUpdateSchema, policyBaseResponseSchema } from '@/domain/realm/policy/policy.dto';
import { PolicySchema, PolicyCreate } from '@/domain/realm/policy/policy.entity';

export const PolicyControllerSymbol = Symbol.for('PolicyController');

@SwaggerDocController({
  name: 'Policies',
  description: 'Policy management',
  tags: ['Policies'],
})
@Controller(PolicyControllerSymbol, {
  basePath: '/api/realm/:tenantId/policy',
  multiTenant: true,
})
export class PolicyController extends AbstractCrudController<PolicySchema, PolicyDtoTypes, PolicyCreate> {
  constructor(
    @inject(PolicyServiceSymbol) protected service: PolicyService,
    @inject(PolicyMapperSymbol) protected mapper: PolicyMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.policies';
  }

  @SwaggerDoc({
    summary: 'Create policy',
    tags: ['Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: policyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy created',
        content: {
          'application/json': {
            schema: policyBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: policyCreateSchema })
  @Post('/')
  async create(ctx: ContextWithBody<PolicyDtoTypes['CreateRequestDto']>): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List policies',
    tags: ['Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of policies',
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
    summary: 'Get policy by ID',
    tags: ['Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy found',
        content: {
          'application/json': {
            schema: policyBaseResponseSchema,
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
    summary: 'Update policy',
    tags: ['Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: policyUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Policy updated',
        content: {
          'application/json': {
            schema: policyBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema, body: policyUpdateSchema })
  @Put('/:id')
  async update(ctx: ContextWithParamsAndBody<IdWithTenantParam, PolicyDtoTypes['UpdateRequestDto']>): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete policy',
    tags: ['Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy deleted',
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
