import { MagicRouter } from '../swagger/MagicRouter';
import * as accounts from './accounts/v1/accounts.routes';
import * as groups from './groups/v1/groups.routes';
// import * as roles from './roles/v1/roles.routes';
// import * as policies from './policies/v1/policies.routes';
// import * as accountGroups from './account-groups/v1/account-groups.routes';
// import * as groupRoles from './group-roles/v1/group-roles.routes';
// import * as accountRoles from './account-roles/v1/account-roles.routes';
// import * as authentication from './authentication/v1/authentication.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realm/:tenantId' });

  const accountsRouter = await accounts.initialize();
  const groupsRouter = await groups.initialize();
  // const rolesRouter = await roles.initialize();
  // const policiesRouter = await policies.initialize();
  // const accountGroupsRouter = await accountGroups.initialize();
  // const groupRolesRouter = await groupRoles.initialize();
  // const accountRolesRouter = await accountRoles.initialize();
  // const authenticationRouter = await authentication.initialize();

  router.useMagicRouter(accountsRouter);
  router.useMagicRouter(groupsRouter);
  // router.use(rolesRouter.routes());
  // router.use(policiesRouter.routes());
  // router.use(accountGroupsRouter.routes());
  // router.use(groupRolesRouter.routes());
  // router.use(accountRolesRouter.routes());
  // router.use(authenticationRouter.routes());

  return router;
};
