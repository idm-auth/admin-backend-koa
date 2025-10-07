import { errorHandler } from '@/middleware/errorHandler.middleware';
import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import { initialize as swaggerPlugin } from '@/plugins/swagger.plugin';
import { initialize as router } from '@/routes/index.routes';
import { initialize as swaggerRoutes } from '@/routes/swagger.routes';
import { logRoutesDetailed } from '@/utils/routeLoggerDetailed.util';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';

const app = new Koa();

export const initialize = async () => {
  // Error handler deve ser o primeiro middleware
  app.use(errorHandler);

  app.use(cors());
  app.use(bodyParser());
  app.use(requestIdMiddleware);

  const appRouter = await router();
  app.use(appRouter.routes());

  // Swagger routes apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    const swagger = await swaggerRoutes();
    app.use(swagger.routes());
  }

  // Swagger plugin (static files) depois das rotas
  if (process.env.NODE_ENV !== 'production') {
    swaggerPlugin(app);
  }

  // Log das rotas registradas
  if (process.env.NODE_ENV == 'developer') {
    logRoutesDetailed(appRouter);
  }
  return app;
};

export const listen = async () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};
