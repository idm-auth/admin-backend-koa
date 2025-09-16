import { requestIdMiddleware } from '@/middleware/requestId.middleware';
import router from '@/routes/index.routes';
import cors from '@koa/cors';
import Koa from 'koa';

const initialize = async () => {
  const app = new Koa();
  app.use(cors());

  app.use(requestIdMiddleware);
  app.use(router.initialize().routes());

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};

export const koa = {
  initialize,
};
