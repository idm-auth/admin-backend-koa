import { applicationConfigurationResponseSchema } from '@/domain/realm/application-configuration/application-configuration.dto';
import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractEnv, EnvSymbol } from 'koa-inversify-framework';
import { AbstractController } from 'koa-inversify-framework/abstract';
import {
  commonErrorResponses,
  EnvKey,
  HttpMethod,
} from 'koa-inversify-framework/common';
import {
  Get,
  InjectCoreTenantId,
  SwaggerDoc,
  SwaggerDocController,
} from 'koa-inversify-framework/decorator';
import {
  RegisterRouter,
  RegisterRouterSymbol,
} from 'koa-inversify-framework/infrastructure';
import { Controller } from 'koa-inversify-framework/stereotype';
import { z } from 'zod';

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
        systemId: z.string(),
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
  @Get('/app/:systemId/env/:environment')
  async getByApplicationAndEnvironment(
    ctx: Context & {
      params: {
        systemId: string;
        environment: string;
      };
    } & { state: { tenantId?: string } }
  ): Promise<void> {
    const { systemId, environment } = ctx.params;
    const tenantId = ctx.state.tenantId!;
    const contextPath = this.env.get(EnvKey.SERVER_CONTEXT_PATH);
    const targetPath =
      `${contextPath}/api/realm/:tenantId/application-configuration/app/:systemId/env/:environment`.replace(
        /\/\//g,
        '/'
      );

    this.log.debug(
      { tenantId, targetPath, systemId, environment },
      'Proxying to realm route'
    );

    const newctx = Object.create(ctx) as Context;
    newctx.params = { ...ctx.params, tenantId, systemId, environment };
    await this.registerRouter.executeRoute(targetPath, HttpMethod.GET, newctx);
  }
}
