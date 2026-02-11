import {
  AccountController,
  AccountControllerSymbol,
} from '@/domain/realm/account/account.controller';
import {
  AccountMapper,
  AccountMapperSymbol,
} from '@/domain/realm/account/account.mapper';
import {
  AccountRepository,
  AccountRepositorySymbol,
} from '@/domain/realm/account/account.repository';
import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';

export class AccountModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(AccountRepositorySymbol)
      .to(AccountRepository)
      .inSingletonScope();
    this.container
      .bind(AccountMapperSymbol)
      .to(AccountMapper)
      .inSingletonScope();
    this.container
      .bind(AccountServiceSymbol)
      .to(AccountService)
      .inSingletonScope();
    this.container
      .bind(AccountControllerSymbol)
      .to(AccountController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AccountControllerSymbol;
  }
}
