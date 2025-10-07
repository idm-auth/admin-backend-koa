import * as accountGroupController from '@/controllers/v1/accountGroup.controller';
import Router from '@koa/router';

export const initialize = async () => {
  const router = new Router({
    prefix: '/account-groups',
  });

  router.post('/', accountGroupController.addAccountToGroup);
  router.delete('/', accountGroupController.removeAccountFromGroup);
  router.put('/', accountGroupController.updateAccountGroupRoles);
  router.get('/account/:accountId', accountGroupController.getAccountGroups);
  router.get('/group/:groupId', accountGroupController.getGroupAccounts);

  return router;
};