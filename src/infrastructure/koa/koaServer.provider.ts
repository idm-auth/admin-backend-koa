import { inject } from 'inversify';
import { Configuration } from '@/infrastructure/core/stereotype.decorator';
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async init(): Promise<void> {
    this.router.get('/', (ctx) => {
      ctx.body = { status: 'ok' };
    });

    this.swagger.setup(this.app);
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(bodyParser());
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  // eslint-disable-next-line @typescript-eslint/require-await
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
