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
  RolePolicyService,
  RolePolicyServiceSymbol,
} from '@/domain/realm/role-policy/role-policy.service';
import {
  RolePolicyMapper,
  RolePolicyMapperSymbol,
} from '@/domain/realm/role-policy/role-policy.mapper';
import {
  RolePolicyDtoTypes,
  rolePolicyCreateSchema,
  rolePolicyBaseResponseSchema,
} from '@/domain/realm/role-policy/role-policy.dto';
import {
  RolePolicySchema,
  RolePolicyCreate,
} from '@/domain/realm/role-policy/role-policy.entity';

export const RolePolicyControllerSymbol = Symbol.for('RolePolicyController');

@SwaggerDocController({
  name: 'Role Policies',
  description: 'Role policy assignment management',
  tags: ['Role Policies'],
})
@Controller(RolePolicyControllerSymbol, {
  basePath: '/api/realm/:tenantId/role-policy',
  multiTenant: true,
})
export class RolePolicyController extends AbstractCrudController<
  RolePolicySchema,
  RolePolicyDtoTypes,
  RolePolicyCreate
> {
  constructor(
    @inject(RolePolicyServiceSymbol) protected service: RolePolicyService,
    @inject(RolePolicyMapperSymbol) protected mapper: RolePolicyMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Assign policy to role',
    tags: ['Role Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: rolePolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy assigned',
        content: {
          'application/json': {
            schema: rolePolicyBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: rolePolicyCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<RolePolicyDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List role policies',
    tags: ['Role Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of role policies',
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
    summary: 'Get role policy by ID',
    tags: ['Role Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Role policy found',
        content: {
          'application/json': {
            schema: rolePolicyBaseResponseSchema,
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
    summary: 'Remove policy from role',
    tags: ['Role Policies'],
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
