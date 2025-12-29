import { AbstractModule } from 'koa-inversify-framework/abstract';
import { AccountGroupController, AccountGroupControllerSymbol } from '@/domain/realm/account-group/account-group.controller';
import { AccountGroupMapper, AccountGroupMapperSymbol } from '@/domain/realm/account-group/account-group.mapper';
import { AccountGroupRepository, AccountGroupRepositorySymbol } from '@/domain/realm/account-group/account-group.repository';
import { AccountGroupService, AccountGroupServiceSymbol } from '@/domain/realm/account-group/account-group.service';

export class AccountGroupModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(AccountGroupRepositorySymbol).to(AccountGroupRepository).inSingletonScope();
    this.container.bind(AccountGroupMapperSymbol).to(AccountGroupMapper).inSingletonScope();
    this.container.bind(AccountGroupServiceSymbol).to(AccountGroupService).inSingletonScope();
    this.container.bind(AccountGroupControllerSymbol).to(AccountGroupController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AccountGroupControllerSymbol;
  }
}
