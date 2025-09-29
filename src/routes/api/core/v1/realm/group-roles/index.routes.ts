import * as groupRoleController from '@/controllers/v1/groupRole.controller';
import Router from '@koa/router';

export const initialize = () => {
  const router = new Router({
    prefix: '/group-roles',
  });

  router.post('/', groupRoleController.addRoleToGroup);
  router.delete('/', groupRoleController.removeRoleFromGroup);
  router.get('/group/:groupId', groupRoleController.getGroupRoles);
  router.get('/role/:roleId', groupRoleController.getRoleGroups);

  return router;
};