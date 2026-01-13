import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import {
  Post,
  SwaggerDoc,
  SwaggerDocController,
  ZodValidateRequest,
} from 'koa-inversify-framework/decorator';
import {
  commonErrorResponses,
  RequestParamsTenantIdSchema,
  ContextWithBody,
} from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import {
  AuthzService,
  AuthzServiceSymbol,
} from '@/domain/realm/authz/authz.service';
import {
  EvaluateRequest,
  evaluateRequestSchema,
  evaluateResponseSchema,
} from '@/domain/realm/authz/authz.dto';

export const AuthzControllerSymbol = Symbol.for('AuthzController');

@SwaggerDocController({
  name: 'Authorization',
  description: 'Authorization evaluation',
  tags: ['Authorization'],
})
@Controller(AuthzControllerSymbol, {
  basePath: '/api/realm/:tenantId/authz',
  multiTenant: true,
})
export class AuthzController extends AbstractController {
  constructor(@inject(AuthzServiceSymbol) private service: AuthzService) {
    super();
  }

  @SwaggerDoc({
    summary: 'Evaluate authorization',
    description:
      'Evaluates if an account has permission to perform an action on a resource (internal use)',
    tags: ['Authorization'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: evaluateRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Authorization evaluation result',
        content: {
          'application/json': {
            schema: evaluateResponseSchema,
          },
        },
      },
      400: commonErrorResponses[400],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({
    params: RequestParamsTenantIdSchema,
    body: evaluateRequestSchema,
  })
  @Post('/evaluate')
  async evaluate(ctx: ContextWithBody<EvaluateRequest>): Promise<void> {
    this.validateMultiTenantSetup(ctx);

    const result = await this.service.evaluate(ctx.request.body);
    ctx.body = result;
  }
}
