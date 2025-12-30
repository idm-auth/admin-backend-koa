import {
  roleBaseResponseSchema,
  roleCreateSchema,
  RoleDtoTypes,
  roleUpdateSchema,
} from '@/domain/realm/role/role.dto';
import { RoleSchema } from '@/domain/realm/role/role.entity';
import { RoleMapper, RoleMapperSymbol } from '@/domain/realm/role/role.mapper';
import {
  RoleService,
  RoleServiceSymbol,
} from '@/domain/realm/role/role.service';
import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import {
  commonErrorResponses,
  ContextWithBody,
  ContextWithParams,
  ContextWithParamsAndBody,
  IdWithTenantParam,
  RequestParamsIdAndTenantIdSchema,
  RequestParamsTenantIdSchema,
} from 'koa-inversify-framework/common';
import {
  Delete,
  Get,
  Post,
  Put,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';

export const RoleControllerSymbol = Symbol.for('RoleController');

@SwaggerDocController({
  name: 'Roles',
  description: 'Role management',
  tags: ['Roles'],
})
@Controller(RoleControllerSymbol, {
  basePath: '/api/realm/:tenantId/role',
  multiTenant: true,
})
export class RoleController extends AbstractCrudController<
  RoleSchema,
  RoleDtoTypes
> {
  constructor(
    @inject(RoleServiceSymbol) protected service: RoleService,
    @inject(RoleMapperSymbol) protected mapper: RoleMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.roles';
  }

  @SwaggerDoc({
    summary: 'Create role',
    tags: ['Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: roleCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Role created',
        content: {
          'application/json': {
            schema: roleBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: roleCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<RoleDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List roles',
    tags: ['Roles'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of roles',
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
    summary: 'Get role by ID',
    tags: ['Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Role found',
        content: {
          'application/json': {
            schema: roleBaseResponseSchema,
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
    summary: 'Update role',
    tags: ['Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: roleUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Role updated',
        content: {
          'application/json': {
            schema: roleBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsIdAndTenantIdSchema,
    body: roleUpdateSchema,
  })
  @Put('/:id')
  async update(
    ctx: ContextWithParamsAndBody<
      IdWithTenantParam,
      RoleDtoTypes['UpdateRequestDto']
    >
  ): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete role',
    tags: ['Roles'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Role deleted',
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
