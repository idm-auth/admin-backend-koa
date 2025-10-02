import Router from '@koa/router';
import * as v1 from './v1/index.routes';

export const initialize = () => {
  const router = new Router();
  
  // Registra rotas v1
  const v1Router = v1.initialize();
  console.log('v1Router received:', typeof v1Router);
  console.log('v1Router.routes type:', typeof v1Router.routes);
  console.log('v1Router constructor:', v1Router.constructor.name);
  router.use(v1Router.routes());

  return router;
};