import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  GroupRoleController,
  GroupRoleControllerSymbol,
} from '@/domain/realm/group-role/group-role.controller';
import {
  GroupRoleMapper,
  GroupRoleMapperSymbol,
} from '@/domain/realm/group-role/group-role.mapper';
import {
  GroupRoleRepository,
  GroupRoleRepositorySymbol,
} from '@/domain/realm/group-role/group-role.repository';
import {
  GroupRoleService,
  GroupRoleServiceSymbol,
} from '@/domain/realm/group-role/group-role.service';

export class GroupRoleModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(GroupRoleRepositorySymbol)
      .to(GroupRoleRepository)
      .inSingletonScope();
    this.container
      .bind(GroupRoleMapperSymbol)
      .to(GroupRoleMapper)
      .inSingletonScope();
    this.container
      .bind(GroupRoleServiceSymbol)
      .to(GroupRoleService)
      .inSingletonScope();
    this.container
      .bind(GroupRoleControllerSymbol)
      .to(GroupRoleController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return GroupRoleControllerSymbol;
  }
}
