import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  Get,
  Post,
  Delete,
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
  IdWithTenantParam,
} from 'koa-inversify-framework/common';
import {
  PolicyResourceService,
  PolicyResourceServiceSymbol,
} from '@/domain/realm/policy-resource/policy-resource.service';
import {
  PolicyResourceMapper,
  PolicyResourceMapperSymbol,
} from '@/domain/realm/policy-resource/policy-resource.mapper';
import {
  PolicyResourceDtoTypes,
  policyResourceCreateSchema,
  policyResourceBaseResponseSchema,
} from '@/domain/realm/policy-resource/policy-resource.dto';
import {
  PolicyResourceSchema,
  PolicyResourceCreate,
} from '@/domain/realm/policy-resource/policy-resource.entity';

export const PolicyResourceControllerSymbol = Symbol.for('PolicyResourceController');

@SwaggerDocController({
  name: 'Policy Resources',
  description: 'Policy resource management',
  tags: ['Policy Resources'],
})
@Controller(PolicyResourceControllerSymbol, {
  basePath: '/api/realm/:tenantId/policy-resource',
  multiTenant: true,
})
export class PolicyResourceController extends AbstractCrudController<
  PolicyResourceSchema,
  PolicyResourceDtoTypes,
  PolicyResourceCreate
> {
  constructor(
    @inject(PolicyResourceServiceSymbol) protected service: PolicyResourceService,
    @inject(PolicyResourceMapperSymbol) protected mapper: PolicyResourceMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Create policy resource',
    tags: ['Policy Resources'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: policyResourceCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy resource created',
        content: {
          'application/json': {
            schema: policyResourceBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: policyResourceCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<PolicyResourceDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List policy resources',
    tags: ['Policy Resources'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of policy resources',
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
    summary: 'Get policy resource by ID',
    tags: ['Policy Resources'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy resource found',
        content: {
          'application/json': {
            schema: policyResourceBaseResponseSchema,
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
    summary: 'Delete policy resource',
    tags: ['Policy Resources'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Policy resource deleted',
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
