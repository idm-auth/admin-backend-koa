import { initialize as api } from '@/domains/api.routes';
import { initialize as swaggerRoutes } from '@/domains/swagger/swagger.routes';
import { errorHandler } from '@/middlewares/errorHandler.middleware';
import { requestIdMiddleware } from '@/middlewares/requestId.middleware';
import { initialize as swaggerPlugin } from '@/plugins/swagger.plugin';
import { logRoutesDetailed } from '@/utils/routeLoggerDetailed.util';
import { MagicRouter } from '@/utils/core/MagicRouter';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';
import { EnvKey, getEnvValue } from './dotenv.plugin';
import { getLogger } from '@/plugins/pino.plugin';

const app = new Koa();
let globalApiRouter: MagicRouter | null = null;

export const initKoa = async () => {
  const logger = await getLogger();
  // RequestId middleware primeiro para criar contexto
  app.use(requestIdMiddleware);
  // Error handler segundo para capturar erros com contexto
  app.use(errorHandler);

  app.use(cors());
  app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'], // Incluir DELETE
    })
  );

  const apiRouter = await api();
  globalApiRouter = apiRouter;
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
  logger.info('Koa server initialized');
  return app;
};

export const listenKoa = async () => {
  const logger = await getLogger();
  const PORT = getEnvValue(EnvKey.PORT);
  app.listen(PORT, () => {
    logger.info(`Koa server running on http://localhost:${PORT}`);
  });
};

export const getApiRouter = (): MagicRouter => {
  if (!globalApiRouter) {
    throw new Error('API Router not initialized. Call initKoa first.');
  }
  return globalApiRouter;
};
