import Router from '@koa/router';
import { initialize as account } from './accounts/index.routes';
import { initialize as group } from './groups/index.routes';
import { initialize as role } from './roles/index.routes';
import { initialize as policy } from './policies/index.routes';
import { initialize as accountGroup } from './account-groups/index.routes';
import { initialize as accountRole } from './account-roles/index.routes';
import { initialize as groupRole } from './group-roles/index.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/realm/:tenantId',
  });
  const accountRouter = await account();
  const groupRouter = await group();
  const roleRouter = await role();
  const policyRouter = await policy();
  const accountGroupRouter = await accountGroup();
  const accountRoleRouter = await accountRole();
  const groupRoleRouter = await groupRole();
  
  router.use(accountRouter.routes());
  router.use(groupRouter.routes());
  router.use(roleRouter.routes());
  router.use(policyRouter.routes());
  router.use(accountGroupRouter.routes());
  router.use(accountRoleRouter.routes());
  router.use(groupRoleRouter.routes());

  return router;
};
