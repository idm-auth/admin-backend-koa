import Router from '@koa/router';
import * as account from './accounts.routes';
import * as group from './groups.routes';
import * as role from './roles.routes';
import * as policy from './policies.routes';
import * as accountGroup from './account-groups.routes';
import * as accountRole from './account-groups.routes';
import * as groupRole from './group-roles.routes';
import * as accountRoles from './account-roles.routes';

export const initialize = async () => {
  const router = new Router({
    prefix: '/v1',
  });
  const accountRouter = await account.initialize();
  const groupRouter = await group.initialize();
  const roleRouter = await role.initialize();
  const policyRouter = await policy.initialize();
  const accountGroupRouter = await accountGroup.initialize();
  const accountRoleRouter = await accountRole.initialize();
  const groupRoleRouter = await groupRole.initialize();
  const accountRolesRouter = await accountRoles.initialize();

  router.use(accountRouter.routes());
  router.use(groupRouter.routes());
  router.use(roleRouter.routes());
  router.use(policyRouter.routes());
  router.use(accountGroupRouter.routes());
  router.use(accountRoleRouter.routes());
  router.use(groupRoleRouter.routes());
  router.use(accountRolesRouter.routes());

  return router;
};
