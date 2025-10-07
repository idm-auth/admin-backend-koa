import * as accountRoleController from '@/controllers/v1/accountRole.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/account-roles',
  });

  router.post('/', accountRoleController.addRoleToAccount);
  router.delete('/', accountRoleController.removeRoleFromAccount);
  router.get('/account/:accountId', accountRoleController.getAccountRoles);
  router.get('/roles/:roleId', accountRoleController.getRoleAccounts);

  return router;
};
