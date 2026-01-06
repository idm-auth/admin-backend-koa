import {
  SystemSetupDtoTypes,
  systemSetupResponseSchema,
  systemSetupUpdateSchema,
} from '@/domain/realm/system-setup/system-setup.dto';
import {
  SystemSetupMapper,
  SystemSetupMapperSymbol,
} from '@/domain/realm/system-setup/system-setup.mapper';
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/realm/system-setup/system-setup.service';
import { SystemSetupSchema } from '@/domain/shared/system-setup/system-setup.entity';
import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractCrudController } from 'koa-inversify-framework/abstract';
import {
  commonErrorResponses,
  ContextWithParamsAndBody,
  RequestParamsTenantIdSchema,
} from 'koa-inversify-framework/common';
import {
  Get,
  Post,
  Put,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';
import { z } from 'zod';

export const SystemSetupControllerSymbol = Symbol.for('SystemSetupController');

@SwaggerDocController({
  name: 'Realm System Setup',
  description: 'Realm-specific setup and configuration',
  tags: ['Realm System Setup'],
})
@Controller(SystemSetupControllerSymbol, {
  basePath: '/api/realm/:tenantId/system-setup',
  multiTenant: true,
})
export class SystemSetupController extends AbstractCrudController<
  SystemSetupSchema,
  SystemSetupDtoTypes,
  never
> {
  constructor(
    @inject(SystemSetupServiceSymbol) protected service: SystemSetupService,
    @inject(SystemSetupMapperSymbol) protected mapper: SystemSetupMapper
  ) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.system-setup';
  }

  @SwaggerDoc({
    summary: 'Get system setup',
    description: 'Returns the system setup configuration',
    tags: ['Realm System Setup'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'System setup found',
        content: {
          'application/json': {
            schema: systemSetupResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      404: commonErrorResponses[404],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema })
  @Get('/')
  async getSetup(ctx: Context): Promise<void> {
    const setup = await this.service.findOne({ setupKey: 'singleton' });
    ctx.body = this.mapper.toFindOneResponseDto(setup);
  }

  @SwaggerDoc({
    summary: 'Update JWT configuration',
    description: 'Updates the JWT configuration for the realm',
    tags: ['Realm System Setup'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: systemSetupUpdateSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'JWT configuration updated successfully',
        content: {
          'application/json': {
            schema: systemSetupResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: systemSetupUpdateSchema,
  })
  @Put('/jwt-config')
  async updateJwtConfig(
    ctx: ContextWithParamsAndBody<
      { tenantId: string },
      SystemSetupDtoTypes['UpdateRequestDto']
    >
  ): Promise<void> {
    const setup = await this.service.findOne({ setupKey: 'singleton' });
    const updated = await this.service.updateFromDto(
      setup._id.toString(),
      ctx.request.body
    );
    ctx.body = this.mapper.toUpdateResponseDto(updated);
  }

  @SwaggerDoc({
    summary: 'Repair realm setup',
    description: 'Checks and recreates default realm resources if missing',
    tags: ['Realm System Setup'],
    request: {
      params: RequestParamsTenantIdSchema,
    },
    responses: {
      200: {
        description: 'Repair completed',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal(200),
            }),
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema })
  @Post('/repair')
  async repairSetup(ctx: Context): Promise<void> {
    const result = await this.service.repairSetup();
    ctx.body = result;
  }
}
