import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  Get,
  Post,
  Put,
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
  ApplicationActionService,
  ApplicationActionServiceSymbol,
} from '@/domain/realm/application-action/application-action.service';
import {
  ApplicationActionMapper,
  ApplicationActionMapperSymbol,
} from '@/domain/realm/application-action/application-action.mapper';
import {
  ApplicationActionDtoTypes,
  applicationActionCreateSchema,
  applicationActionUpdateSchema,
  applicationActionBaseResponseSchema,
} from '@/domain/realm/application-action/application-action.dto';
import {
  ApplicationActionSchema,
  ApplicationActionCreate,
} from '@/domain/realm/application-action/application-action.entity';

export const ApplicationActionControllerSymbol = Symbol.for(
  'ApplicationActionController'
);

@SwaggerDocController({
  name: 'Application Actions',
  description: 'Application available actions management',
  tags: ['Application Actions'],
})
@Controller(ApplicationActionControllerSymbol, {
  basePath: '/api/realm/:tenantId/application-action',
  multiTenant: true,
})
export class ApplicationActionController extends AbstractCrudController<
  ApplicationActionSchema,
  ApplicationActionDtoTypes,
  ApplicationActionCreate
> {
  constructor(
    @inject(ApplicationActionServiceSymbol)
    protected service: ApplicationActionService,
    @inject(ApplicationActionMapperSymbol)
    protected mapper: ApplicationActionMapper
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Create application action',
    tags: ['Application Actions'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationActionCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Action created',
        content: {
          'application/json': {
            schema: applicationActionBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: applicationActionCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<ApplicationActionDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List application actions',
    tags: ['Application Actions'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of application actions',
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
    summary: 'Get application action by ID',
    tags: ['Application Actions'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Action found',
        content: {
          'application/json': {
            schema: applicationActionBaseResponseSchema,
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
    summary: 'Update application action',
    tags: ['Application Actions'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationActionUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Action updated',
        content: {
          'application/json': {
            schema: applicationActionBaseResponseSchema,
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
    body: applicationActionUpdateSchema,
  })
  @Put('/:id')
  async update(
    ctx: ContextWithBody<ApplicationActionDtoTypes['UpdateRequestDto']> &
      ContextWithParams<IdWithTenantParam>
  ): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete application action',
    tags: ['Application Actions'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Action deleted',
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
