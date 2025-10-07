import Router from '@koa/router';
// import { initialize as realm } from './realm/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  // const realmRouter = await realm();
  // router.use(realmRouter.routes());

  return router;
};
