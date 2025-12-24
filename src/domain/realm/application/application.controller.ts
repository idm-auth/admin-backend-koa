import { inject } from 'inversify';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, Post, Put, Delete, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsIdAndTenantIdSchema, RequestParamsTenantIdSchema } from 'koa-inversify-framework/common';
import { Context } from 'koa';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';
import { ApplicationMapper, ApplicationMapperSymbol } from '@/domain/realm/application/application.mapper';
import { ApplicationDtoTypes, applicationCreateSchema, applicationUpdateSchema, applicationBaseResponseSchema } from '@/domain/realm/application/application.dto';
import { ApplicationSchema } from '@/domain/realm/application/application.entity';

export const ApplicationControllerSymbol = Symbol.for('ApplicationController');

@SwaggerDocController({
  name: 'Applications',
  description: 'Application management',
  tags: ['Applications'],
})
@Controller(ApplicationControllerSymbol, {
  basePath: '/api/realm/:tenantId/applications',
  multiTenant: true,
})
export class ApplicationController extends AbstractController<ApplicationSchema, ApplicationDtoTypes> {
  constructor(
    @inject(ApplicationServiceSymbol) protected service: ApplicationService,
    @inject(ApplicationMapperSymbol) protected mapper: ApplicationMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.applications';
  }

  @SwaggerDoc({
    summary: 'Create application',
    tags: ['Applications'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Application created',
        content: {
          'application/json': {
            schema: applicationBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: applicationCreateSchema })
  @Post('/')
  async create(ctx: Context): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List applications',
    tags: ['Applications'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of applications',
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
    summary: 'Get application by ID',
    tags: ['Applications'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Application found',
        content: {
          'application/json': {
            schema: applicationBaseResponseSchema,
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
    summary: 'Update application',
    tags: ['Applications'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Application updated',
        content: {
          'application/json': {
            schema: applicationBaseResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsIdAndTenantIdSchema, body: applicationUpdateSchema })
  @Put('/:id')
  async update(ctx: Context): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete application',
    tags: ['Applications'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Application deleted',
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
