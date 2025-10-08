import { MagicRouter } from '../../utils/core/MagicRouter';
import * as accounts from './accounts/v1/accounts.routes';
import * as groups from './groups/v1/groups.routes';
import * as roles from './roles/v1/roles.routes';
import * as policies from './policies/v1/policies.routes';
import * as accountGroups from './account-groups/v1/account-groups.routes';
import * as groupRoles from './group-roles/v1/group-roles.routes';
import * as accountRoles from './account-roles/v1/account-roles.routes';
import * as authentication from './authentication/v1/authentication.routes';

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
