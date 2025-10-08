import { readFileSync } from 'fs';
import { Context } from 'koa';
import { absolutePath } from 'swagger-ui-dist';
import { MagicRouter } from './MagicRouter';
import { getOpenAPIDocument } from './openApiGenerator';

export const initialize = async () => {
  const router = new MagicRouter();

  // Custom HTML with correct title and base path
  router.get('/api-docs-ui', async (ctx: Context) => {
    ctx.type = 'text/html';
    ctx.body = readFileSync(absolutePath() + '/index.html', 'utf8')
      .replace('<head>', '<head>\n    <base href="/api-docs/">')
      .replace('<title>Swagger UI</title>', '<title>API Documentation</title>');
  });

  // Custom swagger-initializer.js
  router.get('/api-docs/swagger-initializer.js', async (ctx: Context) => {
    ctx.type = 'application/javascript';
    ctx.body = readFileSync(
      absolutePath() + '/swagger-initializer.js',
      'utf8'
    ).replace(
      'https://petstore.swagger.io/v2/swagger.json',
      '/api-docs/swagger.json'
    );
  });

  // OpenAPI JSON
  router.get('/api-docs/swagger.json', async (ctx: Context) => {
    ctx.type = 'application/json';
    ctx.body = getOpenAPIDocument();
  });

  return router;
};
