import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractController } from 'koa-inversify-framework/abstract';
import {
  commonErrorResponses,
  emailSchema,
  passwordSchema,
} from 'koa-inversify-framework/common';
import {
  InjectCoreTenantId,
  Post,
  SwaggerDoc,
  SwaggerDocController,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';
import { z } from 'zod';
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/core/system-setup/system-setup.service';

export const SystemSetupControllerSymbol = Symbol.for(
  'SystemSetupController'
);

@SwaggerDocController({
  name: 'System Setup',
  description: 'System initialization and repair operations',
  tags: ['System Setup'],
})
@Controller(SystemSetupControllerSymbol, {
  basePath: '/api/core/system-setup',
})
export class SystemSetupController extends AbstractController {
  constructor(
    @inject(SystemSetupServiceSymbol)
    private readonly systemSetupService: SystemSetupService
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Initialize system setup',
    description:
      'Creates core realm, admin account, and default system resources',
    tags: ['System Setup'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: z.object({
              adminAccount: z.object({
                email: emailSchema,
                password: passwordSchema,
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
  @InjectCoreTenantId()
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
    const result = await this.systemSetupService.initSetup(ctx.request.body);
    ctx.status = result.status;
    ctx.body = result;
  }
}
