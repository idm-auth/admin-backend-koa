import Koa from 'koa';
import router from '@/routes/index.routes';

const initialize = async () => {
  const app = new Koa();

  app.use(router.initialize().routes());

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Koa server running on http://localhost:${PORT}`);
  });
};

export const koa = {
  initialize,
};
