import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { commonErrorResponses, HttpMethod } from 'koa-inversify-framework/common';
import {
  Get,
  InjectCoreTenantId,
  Post,
  SwaggerDoc,
  SwaggerDocController,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  RegisterRouter,
  RegisterRouterSymbol,
  Env,
  EnvSymbol,
  EnvKey,
} from 'koa-inversify-framework/infrastructure';
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
    private readonly env: Env
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
  @InjectCoreTenantId()
  @Get('/app/:applicationName/env/:environment')
  async getByApplicationAndEnvironment(
    ctx: Context & {
      params: {
        applicationName: string;
        environment: string;
        tenantId?: string;
      };
    } & { state: { tenantId?: string } }
  ): Promise<void> {
    const { applicationName, environment } = ctx.params;
    const tenantId = ctx.state.tenantId!;

    const contextPath = this.env.get(EnvKey.SERVER_CONTEXT_PATH);
    const targetPath = `${contextPath}/api/realm/:tenantId/application-configuration/app/:applicationName/env/:environment`;

    ctx.params = { tenantId, applicationName, environment };

    await this.registerRouter.executeRoute(targetPath, HttpMethod.GET, ctx);
  }

  @SwaggerDoc({
    summary: 'Initialize system setup (core realm)',
    description:
      'Creates core realm, admin account, and default system resources',
    tags: ['Core Application Configuration'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              adminAccount: z.object({
                email: z.string().email(),
                password: z.string().min(8),
              }),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Setup already exists',
        content: {
          'application/json': {
            schema: z.object({ status: z.literal(200) }),
          },
        },
      },
      201: {
        description: 'Setup created successfully',
        content: {
          'application/json': {
            schema: z.object({ status: z.literal(201) }),
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @Post('/init-setup')
  async initSetup(
    ctx: Context & {
      request: {
        body: {
          adminAccount: { email: string; password: string };
        };
      };
    }
  ): Promise<void> {
    // TODO: Implement initSetup
    ctx.body = { status: 200 };
  }

  /**
   * EXCEPTION TO ARCHITECTURE RULE: Business logic in controller
   *
   * This function intentionally retrieves tenantId from core realm service
   * instead of receiving it as a parameter. This is a documented exception
   * because:
   *
   * 1. repairDefaultSetup MUST operate on core realm only
   * 2. Forcing tenantId from core prevents accidental misuse on wrong tenant
   * 3. This is an administrative operation, not a regular tenant-scoped API
   * 4. Security: Ensures repair operations only affect the intended core realm
   *
   * This exception is acceptable because it enforces correctness and prevents
   * dangerous operations on wrong tenants.
   */
  @SwaggerDoc({
    summary: 'Repair default setup (core realm)',
    description: 'Checks and recreates default system resources if missing',
    tags: ['Core Application Configuration'],
    responses: {
      200: {
        description: 'Repair completed',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal(200),
              tenantId: z.string(),
            }),
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @InjectCoreTenantId()
  @Post('/repair-default-setup')
  async repairDefaultSetup(
    ctx: Context & { state: { tenantId?: string } }
  ): Promise<void> {
    // TODO: Implement repairDefaultSetup
    const tenantId = ctx.state.tenantId!;
    ctx.body = { status: 200, tenantId };
  }
}
