import { MagicRouter } from '../../utils/core/MagicRouter';
import * as accounts from './accounts/accounts.routes';
import * as groups from './groups/groups.routes';
import * as roles from './roles/roles.routes';
import * as policies from './policies/policies.routes';
import * as accountGroups from './account-groups/account-groups.routes';
import * as groupRoles from './group-roles/group-roles.routes';
import * as accountRoles from './account-roles/account-roles.routes';
import * as authentication from './authentication/authentication.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realm/:tenantId' });

  const accountsRouter = await accounts.initialize();
  const groupsRouter = await groups.initialize();
  const rolesRouter = await roles.initialize();
  const policiesRouter = await policies.initialize();
  const accountGroupsRouter = await accountGroups.initialize();
  const groupRolesRouter = await groupRoles.initialize();
  const accountRolesRouter = await accountRoles.initialize();
  const authenticationRouter = await authentication.initialize();

  router.useMagic(accountsRouter);
  router.useMagic(groupsRouter);
  router.useMagic(rolesRouter);
  router.useMagic(policiesRouter);
  router.useMagic(accountGroupsRouter);
  router.useMagic(groupRolesRouter);
  router.useMagic(accountRolesRouter);
  router.useMagic(authenticationRouter);

  return router;
};
