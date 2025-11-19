import { errorHandler } from '@/middlewares/errorHandler.middleware';
import { requestIdMiddleware } from '@/middlewares/requestId.middleware';
import { initialize as swaggerPlugin } from '@/plugins/swagger.plugin';
import { initialize as api } from '@/domains/api.routes';
import { initialize as swaggerRoutes } from '@/domains/swagger/swagger.routes';
import { logRoutesDetailed } from '@/utils/routeLoggerDetailed.util';
import { getEnvValue, EnvKey } from './dotenv.plugin';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';

const app = new Koa();

export const initKoa = async () => {
  // Error handler deve ser o primeiro middleware
  app.use(errorHandler);

  app.use(cors());
  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'], // Incluir DELETE
    })
  );
  app.use(requestIdMiddleware);

  const apiRouter = await api();
  app.use(apiRouter.routes());

  // Swagger routes apenas em desenvolvimento
  if (getEnvValue(EnvKey.NODE_ENV) !== 'production') {
    const swagger = await swaggerRoutes();
    apiRouter.registryAll();
    app.use(swagger.routes());
    swaggerPlugin(app);
    // Log das rotas registradas
    if (getEnvValue(EnvKey.NODE_ENV) === 'development') {
      logRoutesDetailed(swagger);
    }
  }

  // Log das rotas registradas
  if (getEnvValue(EnvKey.NODE_ENV) === 'development') {
    logRoutesDetailed(apiRouter.getInternalRouter());
  }

  return app;
};

export const listenKoa = async () => {
  const PORT = getEnvValue(EnvKey.PORT);
  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};
