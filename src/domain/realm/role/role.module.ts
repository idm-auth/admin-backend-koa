import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  RoleController,
  RoleControllerSymbol,
} from '@/domain/realm/role/role.controller';
import { RoleMapper, RoleMapperSymbol } from '@/domain/realm/role/role.mapper';
import {
  RoleRepository,
  RoleRepositorySymbol,
} from '@/domain/realm/role/role.repository';
import {
  RoleService,
  RoleServiceSymbol,
} from '@/domain/realm/role/role.service';

export class RoleModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(RoleRepositorySymbol)
      .to(RoleRepository)
      .inSingletonScope();
    this.container.bind(RoleMapperSymbol).to(RoleMapper).inSingletonScope();
    this.container.bind(RoleServiceSymbol).to(RoleService).inSingletonScope();
    this.container
      .bind(RoleControllerSymbol)
      .to(RoleController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return RoleControllerSymbol;
  }
}
