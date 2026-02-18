import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  AccountRoleController,
  AccountRoleControllerSymbol,
} from '@/domain/realm/account-role/account-role.controller';
import {
  AccountRoleMapper,
  AccountRoleMapperSymbol,
} from '@/domain/realm/account-role/account-role.mapper';
import {
  AccountRoleRepository,
  AccountRoleRepositorySymbol,
} from '@/domain/realm/account-role/account-role.repository';
import {
  AccountRoleService,
  AccountRoleServiceSymbol,
} from '@/domain/realm/account-role/account-role.service';

export class AccountRoleModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(AccountRoleRepositorySymbol)
      .to(AccountRoleRepository)
      .inSingletonScope();
    this.container
      .bind(AccountRoleMapperSymbol)
      .to(AccountRoleMapper)
      .inSingletonScope();
    this.container
      .bind(AccountRoleServiceSymbol)
      .to(AccountRoleService)
      .inSingletonScope();
    this.container
      .bind(AccountRoleControllerSymbol)
      .to(AccountRoleController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AccountRoleControllerSymbol;
  }
}
