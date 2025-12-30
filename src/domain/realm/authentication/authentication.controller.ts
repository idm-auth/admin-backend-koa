import { AbstractController } from 'koa-inversify-framework/abstract';
import { Controller } from 'koa-inversify-framework/stereotype';
import { Post, SwaggerDoc, SwaggerDocController, ZodValidateRequest } from 'koa-inversify-framework/decorator';
import { commonErrorResponses, RequestParamsTenantIdSchema, ContextWithBody } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import { AuthenticationService, AuthenticationServiceSymbol } from '@/domain/realm/authentication/authentication.service';
import { LoginRequest, loginRequestSchema, loginResponseSchema } from '@/domain/realm/authentication/authentication.dto';

export const AuthenticationControllerSymbol = Symbol.for('AuthenticationController');

@SwaggerDocController({
  name: 'Authentication',
  description: 'Authentication management',
  tags: ['Authentication'],
})
@Controller(AuthenticationControllerSymbol, {
  basePath: '/api/realm/:tenantId/authentication',
  multiTenant: true,
})
export class AuthenticationController extends AbstractController {
  constructor(
    @inject(AuthenticationServiceSymbol) private service: AuthenticationService
  ) {
    super();
  }

  @SwaggerDoc({
    summary: 'Login',
    description: 'Authenticate with email and password',
    tags: ['Authentication'],
    request: {
      params: RequestParamsTenantIdSchema,
      body: {
        content: {
          'application/json': {
            schema: loginRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: loginResponseSchema,
          },
        },
      },
      401: commonErrorResponses[401],
      500: commonErrorResponses[500],
    },
  })
  @ZodValidateRequest({ params: RequestParamsTenantIdSchema, body: loginRequestSchema })
  @Post('/login')
  async login(ctx: ContextWithBody<LoginRequest>): Promise<void> {
    this.validateMultiTenantSetup(ctx);
    const result = await this.service.login(ctx.request.body);
    ctx.status = 200;
    ctx.body = result;
  }
}
