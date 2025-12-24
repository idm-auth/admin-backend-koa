import { inject } from 'inversify';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema } from 'koa-inversify-framework/common';
import { Context } from 'koa';
import { GroupRoleService, GroupRoleServiceSymbol } from '@/domain/realm/group-role/group-role.service';
import { GroupRoleMapper, GroupRoleMapperSymbol } from '@/domain/realm/group-role/group-role.mapper';
import { GroupRoleDtoTypes, groupRoleCreateSchema, groupRoleBaseResponseSchema } from '@/domain/realm/group-role/group-role.dto';
import { GroupRoleSchema } from '@/domain/realm/group-role/group-role.entity';

export const GroupRoleControllerSymbol = Symbol.for('GroupRoleController');

@SwaggerDocController({
  name: 'Group Roles',
  description: 'Group role assignment management',
  tags: ['Group Roles'],
})
@Controller(GroupRoleControllerSymbol, {
  basePath: '/api/realm/:tenantId/group-roles',
  multiTenant: true,
})
export class GroupRoleController extends AbstractController<GroupRoleSchema, GroupRoleDtoTypes> {
  constructor(
    @inject(GroupRoleServiceSymbol) protected service: GroupRoleService,
    @inject(GroupRoleMapperSymbol) protected mapper: GroupRoleMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.group-roles';
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
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: groupRoleCreateSchema })
  @Post('/')
  async create(ctx: Context): Promise<void> {
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
  async findById(ctx: Context): Promise<void> {
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
  async delete(ctx: Context): Promise<void> {
    return super.delete(ctx);
  }
}
