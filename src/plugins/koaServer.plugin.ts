import { errorHandler } from '@/middlewares/errorHandler.middleware';
import { requestIdMiddleware } from '@/middlewares/requestId.middleware';
import { initialize as swaggerPlugin } from '@/plugins/swagger.plugin';
import { initialize as api } from '@/domains/api.routes';
import { initialize as swaggerRoutes } from '@/domains/swagger/swagger.routes';
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

  const apiRouter = await api();
  app.use(apiRouter.routes());

  // Swagger routes apenas em desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    const swagger = await swaggerRoutes();
    apiRouter.registryAll();
    app.use(swagger.routes());
    swaggerPlugin(app);
    // Log das rotas registradas
    if (process.env.NODE_ENV == 'development') {
      logRoutesDetailed(swagger);
    }
  }

  // Log das rotas registradas
  if (process.env.NODE_ENV == 'development') {
    logRoutesDetailed(apiRouter.getInternalRouter());
  }
  return app;
};

export const listen = async () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};
