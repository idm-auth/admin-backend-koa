import Router from '@koa/router';
import { initialize as account } from './accounts/index.routes';
import { initialize as group } from './groups/index.routes';
import { initialize as role } from './roles/index.routes';
import { initialize as policy } from './policies/index.routes';
import { initialize as accountGroup } from './account-groups/index.routes';
import { initialize as accountRole } from './account-roles/index.routes';
import { initialize as groupRole } from './group-roles/index.routes';

export const initialize = () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  router.use(account().routes());
  router.use(group().routes());
  router.use(role().routes());
  router.use(policy().routes());
  router.use(accountGroup().routes());
  router.use(accountRole().routes());
  router.use(groupRole().routes());

  return router;
};
