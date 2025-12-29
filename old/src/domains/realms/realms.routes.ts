import { MagicRouter } from '../../utils/core/MagicRouter';
import * as accounts from './accounts/accounts.routes';
import * as applications from './applications/applications.routes';
import * as groups from './groups/groups.routes';
import * as roles from './roles/roles.routes';
import * as policies from './policies/policies.routes';
import * as accountGroups from './account-groups/account-groups.routes';
import * as groupRoles from './group-roles/group-roles.routes';
import * as accountRoles from './account-roles/account-roles.routes';
import * as rolePolicies from './role-policies/role-policies.routes';
import * as accountPolicies from './account-policies/account-policies.routes';
import * as groupPolicies from './group-policies/group-policies.routes';
import * as authentication from './authentication/authentication.routes';

export const initialize = async () => {
  const router = new MagicRouter({ prefix: '/realm/:tenantId' });

  const accountsRouter = await accounts.initialize();
  const applicationsRouter = await applications.initialize();
  const groupsRouter = await groups.initialize();
  const rolesRouter = await roles.initialize();
  const policiesRouter = await policies.initialize();
  const accountGroupsRouter = await accountGroups.initialize();
  const groupRolesRouter = await groupRoles.initialize();
  const accountRolesRouter = await accountRoles.initialize();
  const rolePoliciesRouter = await rolePolicies.initialize();
  const accountPoliciesRouter = await accountPolicies.initialize();
  const groupPoliciesRouter = await groupPolicies.initialize();
  const authenticationRouter = await authentication.initialize();

  router.useMagic(accountsRouter);
  router.useMagic(applicationsRouter);
  router.useMagic(groupsRouter);
  router.useMagic(rolesRouter);
  router.useMagic(policiesRouter);
  router.useMagic(accountGroupsRouter);
  router.useMagic(groupRolesRouter);
  router.useMagic(accountRolesRouter);
  router.useMagic(rolePoliciesRouter);
  router.useMagic(accountPoliciesRouter);
  router.useMagic(groupPoliciesRouter);
  router.useMagic(authenticationRouter);

  return router;
};
