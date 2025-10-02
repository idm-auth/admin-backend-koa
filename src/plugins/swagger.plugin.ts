import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import { absolutePath } from 'swagger-ui-dist';

export const initialize = (app: Koa) => {
  // Serve swagger-ui static files
  app.use(mount('/api-docs', serve(absolutePath())));
};
