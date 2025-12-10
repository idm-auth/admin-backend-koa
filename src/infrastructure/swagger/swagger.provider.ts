import { injectable } from 'inversify';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import { absolutePath } from 'swagger-ui-dist';

export const SwaggerSymbol = Symbol.for('Swagger');

@injectable()
export class Swagger {
  setup(app: Koa): void {
    app.use(mount('/api-docs', serve(absolutePath())));
  }
}
