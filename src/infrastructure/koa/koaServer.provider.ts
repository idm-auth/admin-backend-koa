import { inject } from 'inversify';
import { Configuration } from '@/infrastructure/core/stereotype/configuration.stereotype';
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
import {
  RegisterRouter,
  RegisterRouterSymbol,
} from '@/infrastructure/koa/registerRouter.provider';

export const KoaServerSymbol = Symbol.for('KoaServer');

@Configuration(KoaServerSymbol)
export class KoaServer implements ILifecycle {
  private app: Koa;
  private router: Router;
  private server: ReturnType<Koa['listen']> | null = null;

  constructor(
    @inject(EnvSymbol) private env: Env,
    @inject(SwaggerSymbol) private swagger: Swagger,
    @inject(RegisterRouterSymbol) private registerRouter: RegisterRouter
  ) {
    this.app = new Koa();
    this.router = new Router();
  }

  async init(): Promise<void> {
    this.router.get('/', (ctx) => {
      ctx.body = { status: 'ok' };
    });

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

    await this.registerRouter.setup(this.app, this.router);

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
