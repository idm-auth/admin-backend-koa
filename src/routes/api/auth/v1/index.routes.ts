import Router from '@koa/router';
import realm from './realm/index.routes';

const initialize = () => {
  const router = new Router({
    prefix: '/v1',
  });

  router.use(realm.initialize().routes());

  return router;
};

export default { initialize };
