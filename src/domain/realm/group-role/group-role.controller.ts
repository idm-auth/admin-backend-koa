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
  GroupRoleService,
  GroupRoleServiceSymbol,
} from '@/domain/realm/group-role/group-role.service';
import {
  GroupRoleMapper,
  GroupRoleMapperSymbol,
} from '@/domain/realm/group-role/group-role.mapper';
import {
  GroupRoleDtoTypes,
  groupRoleCreateSchema,
  groupRoleBaseResponseSchema,
} from '@/domain/realm/group-role/group-role.dto';
import {
  GroupRoleSchema,
  GroupRoleCreate,
} from '@/domain/realm/group-role/group-role.entity';

export const GroupRoleControllerSymbol = Symbol.for('GroupRoleController');

@SwaggerDocController({
  name: 'Group Roles',
  description: 'Group role assignment management',
  tags: ['Group Roles'],
})
@Controller(GroupRoleControllerSymbol, {
  basePath: '/api/realm/:tenantId/group-role',
  multiTenant: true,
})
export class GroupRoleController extends AbstractCrudController<
  GroupRoleSchema,
  GroupRoleDtoTypes,
  GroupRoleCreate
> {
  constructor(
    @inject(GroupRoleServiceSymbol) protected service: GroupRoleService,
    @inject(GroupRoleMapperSymbol) protected mapper: GroupRoleMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Assign role to group',
    tags: ['Group Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: groupRoleCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Role assigned',
        content: {
          'application/json': {
            schema: groupRoleBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: groupRoleCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<GroupRoleDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List group roles',
    tags: ['Group Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of group roles',
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
    summary: 'Get group role by ID',
    tags: ['Group Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Group role found',
        content: {
          'application/json': {
            schema: groupRoleBaseResponseSchema,
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
    summary: 'Remove role from group',
    tags: ['Group Roles'],
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
