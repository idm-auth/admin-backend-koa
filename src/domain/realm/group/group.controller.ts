import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Put, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema, ContextWithBody, ContextWithParams, ContextWithParamsAndBody, IdWithTenantParam } from 'koa-inversify-framework/common';
import { GroupService, GroupServiceSymbol } from '@/domain/realm/group/group.service';
import { GroupMapper, GroupMapperSymbol } from '@/domain/realm/group/group.mapper';
import { GroupDtoTypes, groupCreateSchema, groupUpdateSchema, groupBaseResponseSchema } from '@/domain/realm/group/group.dto';
import { GroupSchema } from '@/domain/realm/group/group.entity';

export const GroupControllerSymbol = Symbol.for('GroupController');

@SwaggerDocController({
  name: 'Groups',
  description: 'Group management',
  tags: ['Groups'],
})
@Controller(GroupControllerSymbol, {
  basePath: '/api/realm/:tenantId/group',
  multiTenant: true,
})
export class GroupController extends AbstractCrudController<GroupSchema, GroupDtoTypes> {
  constructor(
    @inject(GroupServiceSymbol) protected service: GroupService,
    @inject(GroupMapperSymbol) protected mapper: GroupMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.groups';
  }

  @SwaggerDoc({
    summary: 'Create group',
    tags: ['Groups'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: groupCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Group created',
        content: {
          'application/json': {
            schema: groupBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: groupCreateSchema })
  @Post('/')
  async create(ctx: ContextWithBody<GroupDtoTypes['CreateRequestDto']>): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List groups',
    tags: ['Groups'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of groups',
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
    summary: 'Get group by ID',
    tags: ['Groups'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Group found',
        content: {
          'application/json': {
            schema: groupBaseResponseSchema,
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
    summary: 'Update group',
    tags: ['Groups'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: groupUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Group updated',
        content: {
          'application/json': {
            schema: groupBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema, body: groupUpdateSchema })
  @Put('/:id')
  async update(ctx: ContextWithParamsAndBody<IdWithTenantParam, GroupDtoTypes['UpdateRequestDto']>): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete group',
    tags: ['Groups'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Group deleted',
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
