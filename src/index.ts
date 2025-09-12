import { koa } from '@/configs/koa-server';

(async () => {
  await koa.initialize();
})();
