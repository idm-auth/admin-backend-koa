import { inject } from 'inversify';
import { Context } from 'koa';
import { AbstractController } from 'koa-inversify-framework/abstract';
import { commonErrorResponses } from 'koa-inversify-framework/common';
import {
  Post,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import { Controller } from 'koa-inversify-framework/stereotype';
import { z } from 'zod';
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/realm/system-setup/system-setup.service';
import { RequestParamsTenantIdSchema } from 'koa-inversify-framework/common';

export const SystemSetupControllerSymbol = Symbol.for(
  'SystemSetupController'
);

@SwaggerDocController({
  name: 'Realm Setup',
  description: 'Realm-specific setup and repair operations',
  tags: ['Realm Setup'],
})
@Controller(SystemSetupControllerSymbol, {
  basePath: '/api/realm/:tenantId/system-setup',
  multiTenant: true,
})
export class SystemSetupController extends AbstractController {
  constructor(
    @inject(SystemSetupServiceSymbol)
    private readonly systemSetupService: SystemSetupService
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Repair realm setup',
    description: 'Checks and recreates default realm resources if missing',
    tags: ['Realm Setup'],
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
  @Post('/repair-setup')
  async repairSetup(ctx: Context): Promise<void> {
    const result = await this.systemSetupService.repairSetup();
    ctx.body = result;
  }
}
