import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema, ContextWithBody, ContextWithParams, IdWithTenantParam } from 'koa-inversify-framework/common';
import { GroupPolicyService, GroupPolicyServiceSymbol } from '@/domain/realm/group-policy/group-policy.service';
import { GroupPolicyMapper, GroupPolicyMapperSymbol } from '@/domain/realm/group-policy/group-policy.mapper';
import { GroupPolicyDtoTypes, groupPolicyCreateSchema, groupPolicyBaseResponseSchema } from '@/domain/realm/group-policy/group-policy.dto';
import { GroupPolicySchema, GroupPolicyCreate } from '@/domain/realm/group-policy/group-policy.entity';

export const GroupPolicyControllerSymbol = Symbol.for('GroupPolicyController');

@SwaggerDocController({
  name: 'Group Policies',
  description: 'Group policy assignment management',
  tags: ['Group Policies'],
})
@Controller(GroupPolicyControllerSymbol, {
  basePath: '/api/realm/:tenantId/group-policy',
  multiTenant: true,
})
export class GroupPolicyController extends AbstractCrudController<GroupPolicySchema, GroupPolicyDtoTypes, GroupPolicyCreate> {
  constructor(
    @inject(GroupPolicyServiceSymbol) protected service: GroupPolicyService,
    @inject(GroupPolicyMapperSymbol) protected mapper: GroupPolicyMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.group-policies';
  }

  @SwaggerDoc({
    summary: 'Assign policy to group',
    tags: ['Group Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: groupPolicyCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Policy assigned',
        content: {
          'application/json': {
            schema: groupPolicyBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: groupPolicyCreateSchema })
  @Post('/')
  async create(ctx: ContextWithBody<GroupPolicyDtoTypes['CreateRequestDto']>): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List group policies',
    tags: ['Group Policies'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of group policies',
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
    summary: 'Get group policy by ID',
    tags: ['Group Policies'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Group policy found',
        content: {
          'application/json': {
            schema: groupPolicyBaseResponseSchema,
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
    summary: 'Remove policy from group',
    tags: ['Group Policies'],
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
