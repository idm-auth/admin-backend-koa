import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import { initialize as router } from '@/routes/index.routes';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';

const app = new Koa();

export const initialize = async () => {
  app.use(cors());
  app.use(bodyParser());

  app.use(requestIdMiddleware);
  app.use(router().routes());

  return app;
};

export const listen = async () => {
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};
