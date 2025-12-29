import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Get, SwaggerDoc, SwaggerDocController, InjectCoreTenantId } from 'koa-inversify-framework/decorator';
import { commonErrorResponses } from 'koa-inversify-framework/common';
import { z } from 'zod';
import {
  ApplicationConfigurationController as MultiTenantController,
  ApplicationConfigurationControllerSymbol as MultiTenantControllerSymbol,
} from '@/domain/realm/application-configuration/application-configuration.controller';
import { applicationConfigurationResponseSchema } from '@/domain/realm/application-configuration/application-configuration.dto';

export const CoreApplicationConfigurationControllerSymbol = Symbol.for('CoreApplicationConfigurationController');

@SwaggerDocController({
  name: 'Core Application Configuration',
  description: 'Public application configuration (core realm)',
  tags: ['Core Application Configuration'],
})
@Controller(CoreApplicationConfigurationControllerSymbol, {
  basePath: '/api/core/application-configuration',
})
export class CoreApplicationConfigurationController extends AbstractController {
  constructor(
    @inject(MultiTenantControllerSymbol) private multiTenantController: MultiTenantController
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Get configuration by application and environment (core realm)',
    description: 'Returns configuration for specific application and environment from core realm',
    tags: ['Core Application Configuration'],
    request: {
      params: z.object({
        applicationId: z.string(),
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
  @InjectCoreTenantId()
  @Get('/app/:applicationId/env/:environment')
  async getByApplicationAndEnvironment(ctx: Context): Promise<void> {
    const { applicationId, environment } = ctx.params;
    const tenantId = ctx.state.tenantId;
    
    this.log.debug(
      { applicationId, environment, tenantId },
      'CoreApplicationConfigurationController.getByApplicationAndEnvironment - delegating to multi-tenant controller'
    );
    
    return this.multiTenantController.getByApplicationAndEnvironment(ctx);
  }
}
