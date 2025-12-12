import { inject } from 'inversify';
import { Configuration, getControllerMetadata } from '@/infrastructure/core/stereotype.decorator';
import { getRouteMetadata } from '@/infrastructure/core/route.decorator';
import { container } from '@/infrastructure/core/container.instance';
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import { ILifecycle } from '@/infrastructure/core/app';
import { Env, EnvSymbol, EnvKey } from '@/infrastructure/env/env.provider';
import {
  Swagger,
  SwaggerSymbol,
} from '@/infrastructure/swagger/swagger.provider';
import { AccountController, AccountControllerSymbol } from '@/domain/realm/account/account.controller';

export const KoaServerSymbol = Symbol.for('KoaServer');

@Configuration(KoaServerSymbol)
export class KoaServer implements ILifecycle {
  private app: Koa;
  private router: Router;
  private server: ReturnType<Koa['listen']> | null = null;

  constructor(
    @inject(EnvSymbol) private env: Env,
    @inject(SwaggerSymbol) private swagger: Swagger
  ) {
    this.app = new Koa();
    this.router = new Router();
  }

  private registerController(controllerClass: any, controllerSymbol: symbol): void {
    const controllerMetadata = getControllerMetadata(controllerClass);
    if (!controllerMetadata) return;

    const controller = container.get(controllerSymbol);
    const routes = getRouteMetadata(controllerClass);

    routes.forEach((route) => {
      const fullPath = controllerMetadata.basePath + route.path;
      const handler = (controller as any)[route.methodName].bind(controller);

      switch (route.method) {
        case 'GET':
          this.router.get(fullPath, handler);
          break;
        case 'POST':
          this.router.post(fullPath, handler);
          break;
        case 'PUT':
          this.router.put(fullPath, handler);
          break;
        case 'DELETE':
          this.router.delete(fullPath, handler);
          break;
        case 'PATCH':
          this.router.patch(fullPath, handler);
          break;
      }
    });
  }

  async init(): Promise<void> {
    this.router.get('/', (ctx) => {
      ctx.body = { status: 'ok' };
    });

    this.registerController(AccountController, AccountControllerSymbol);

    this.swagger.setup(this.app);
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser());
    
    // Error handler
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err: any) {
        console.error('Request error:', err);
        ctx.status = err.status || 500;
        ctx.body = { error: err.message };
      }
    });
    
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

   
  async listen(): Promise<void> {
    const PORT = this.env.get(EnvKey.PORT);
    this.server = this.app.listen(parseInt(PORT), () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  async shutdown(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve) => this.server!.close(() => resolve()));
    }
  }
}
