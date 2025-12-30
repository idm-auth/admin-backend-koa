import {
  applicationConfigurationCreateSchema,
  ApplicationConfigurationDtoTypes,
  applicationConfigurationResponseSchema,
  applicationConfigurationUpdateSchema,
} from '@/domain/realm/application-configuration/application-configuration.dto';
import { ApplicationConfigurationSchema } from '@/domain/realm/application-configuration/application-configuration.entity';
import {
  ApplicationConfigurationMapper,
  ApplicationConfigurationMapperSymbol,
} from '@/domain/realm/application-configuration/application-configuration.mapper';
import {
  ApplicationConfigurationService,
  ApplicationConfigurationServiceSymbol,
} from '@/domain/realm/application-configuration/application-configuration.service';
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
import { z } from 'zod';

export const ApplicationConfigurationControllerSymbol = Symbol.for(
  'ApplicationConfigurationController'
);

@SwaggerDocController({
  name: 'Application Configuration',
  description: 'Application configuration management',
  tags: ['Application Configuration'],
})
@Controller(ApplicationConfigurationControllerSymbol, {
  basePath: '/api/realm/:tenantId/application-configuration',
  multiTenant: true,
})
export class ApplicationConfigurationController extends AbstractCrudController<
  ApplicationConfigurationSchema,
  ApplicationConfigurationDtoTypes
> {
  constructor(
    @inject(ApplicationConfigurationServiceSymbol)
    protected service: ApplicationConfigurationService,
    @inject(ApplicationConfigurationMapperSymbol)
    protected mapper: ApplicationConfigurationMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.application-configuration';
  }

  @SwaggerDoc({
    summary: 'Create application configuration',
    description: 'Creates a new application configuration',
    tags: ['Application Configuration'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationConfigurationCreateSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Application configuration created successfully',
        content: {
          'application/json': {
            schema: applicationConfigurationResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: applicationConfigurationCreateSchema,
  })
  @Post('/')
  async create(
    ctx: ContextWithBody<ApplicationConfigurationDtoTypes['CreateRequestDto']>
  ): Promise<void> {
    return super.create(ctx);
  }

  @SwaggerDoc({
    summary: 'List application configurations',
    description: 'Returns paginated list of application configurations',
    tags: ['Application Configuration'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Paginated list of application configurations',
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
    summary: 'Get application configuration by ID',
    description: 'Returns a single application configuration',
    tags: ['Application Configuration'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Application configuration found',
        content: {
          'application/json': {
            schema: applicationConfigurationResponseSchema,
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
    summary: 'Update application configuration',
    description: 'Updates an existing application configuration',
    tags: ['Application Configuration'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: applicationConfigurationUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Application configuration updated successfully',
        content: {
          'application/json': {
            schema: applicationConfigurationResponseSchema,
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
    body: applicationConfigurationUpdateSchema,
  })
  @Put('/:id')
  async update(
    ctx: ContextWithParamsAndBody<
      IdWithTenantParam,
      ApplicationConfigurationDtoTypes['UpdateRequestDto']
    >
  ): Promise<void> {
    return super.update(ctx);
  }

  @SwaggerDoc({
    summary: 'Delete application configuration',
    description: 'Deletes an application configuration',
    tags: ['Application Configuration'],
    request: {
      params: RequestParamsIdAndTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Application configuration deleted successfully',
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

  @SwaggerDoc({
    summary: 'Get configuration by application and environment',
    description:
      'Returns configuration for specific application and environment (config server pattern)',
    tags: ['Application Configuration'],
    request: {
      params: z.object({
        tenantId: z.string(),
        applicationName: z.string(),
        environment: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Configuration found',
        content: {
          'application/json': {
            schema: applicationConfigurationResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @Get('/app/:applicationName/env/:environment')
  async getByApplicationAndEnvironment(
    ctx: ContextWithParams<{
      applicationName: string;
      environment: string;
      tenantId?: string;
    }>
  ): Promise<void> {
    const { applicationName, environment } = ctx.params;
    // TenantId pode vir de params (rota multi-tenant) ou state (decorator @InjectCoreTenantId)
    const tenantId = ctx.params.tenantId;

    this.log.debug(
      {
        applicationName,
        environment,
        tenantId,
      },
      'ApplicationConfigurationController.getByApplicationAndEnvironment - fetching config'
    );

    const config = await this.service.getByApplicationAndEnvironment(
      applicationName,
      environment
    );

    this.log.debug(
      { applicationName, environment, tenantId, configId: config._id },
      'ApplicationConfigurationController.getByApplicationAndEnvironment - config found'
    );

    ctx.body = this.mapper.toFindByIdResponseDto(config);
  }
}
