import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import { errorHandler } from '@/middleware/errorHandler.middleware';
import { initialize as router } from '@/routes/index.routes';
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
  
  const appRouter = router();
  app.use(appRouter.routes());
  
  // Log das rotas registradas
  logRoutesDetailed(appRouter);

  return app;
};

export const listen = async () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};
