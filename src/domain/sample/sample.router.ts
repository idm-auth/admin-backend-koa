import { injectable, inject } from 'inversify';
import Router from '@koa/router';
import {
  SampleController,
  SampleControllerSymbol,
} from '@/domain/sample/sample.controller';

export const SampleRouterSymbol = Symbol.for('SampleRouter');

@injectable()
export class SampleRouter {
  private router: Router;

  constructor(
    @inject(SampleControllerSymbol) private controller: SampleController
  ) {
    this.router = new Router({ prefix: '/samples' });
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/', (ctx) => this.controller.create(ctx));
    this.router.get('/', (ctx) => this.controller.findAll(ctx));
  }

  getRouter(): Router {
    return this.router;
  }
}
