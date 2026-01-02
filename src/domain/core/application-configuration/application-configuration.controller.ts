import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractController } from 'koa-inversify-framework/abstract';
import {
  commonErrorResponses,
  HttpMethod,
} from 'koa-inversify-framework/common';
import {
  Get,
  InjectCoreTenantId,
  SwaggerDoc,
  SwaggerDocController,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  RegisterRouter,
  RegisterRouterSymbol,
} from 'koa-inversify-framework/infrastructure';
import { EnvSymbol, AbstractEnv } from 'koa-inversify-framework';
import { EnvKey } from 'koa-inversify-framework/common';
import { z } from 'zod';
import { applicationConfigurationResponseSchema } from '@/domain/realm/application-configuration/application-configuration.dto';

export const CoreApplicationConfigurationControllerSymbol = Symbol.for(
  'CoreApplicationConfigurationController'
);

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
    @inject(RegisterRouterSymbol)
    private readonly registerRouter: RegisterRouter,
    @inject(EnvSymbol)
    private readonly env: AbstractEnv
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Get configuration by application and environment (core realm)',
    description:
      'Returns configuration for specific application and environment from core realm',
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
  async getByApplicationAndEnvironment(
    ctx: Context & {
      params: {
        applicationId: string;
        environment: string;
        tenantId?: string;
      };
    } & { state: { tenantId?: string } }
  ): Promise<void> {
    const { applicationId, environment } = ctx.params;
    const tenantId = ctx.state.tenantId!;

    const contextPath = this.env.get(EnvKey.SERVER_CONTEXT_PATH);
    const targetPath = `${contextPath}/api/realm/:tenantId/application-configuration/app/:applicationId/env/:environment`;

    ctx.params = { tenantId, applicationId, environment };

    await this.registerRouter.executeRoute(targetPath, HttpMethod.GET, ctx);
  }
}
