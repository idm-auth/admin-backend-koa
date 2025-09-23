import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import router from '@/routes/index.routes';
import bodyParser from '@koa/bodyparser';
import cors from '@koa/cors';
import Koa from 'koa';

const app = new Koa();

const initialize = async () => {
  app.use(cors());
  app.use(bodyParser());

  app.use(requestIdMiddleware);
  app.use(router.initialize().routes());

  return app;
};

const listen = async () => {
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};

export const koa = {
  initialize,
  listen,
};
