import type { Container } from 'inversify';
import type { IModule } from 'koa-inversify-framework/core';
import { AccountRepository, AccountRepositorySymbol } from '@/domain/realm/account/account.repository';
import { AccountMapper, AccountMapperSymbol } from '@/domain/realm/account/account.mapper';
import { AccountService, AccountServiceSymbol } from '@/domain/realm/account/account.service';
import { AccountController, AccountControllerSymbol } from '@/domain/realm/account/account.controller';

export class AccountModule implements IModule {
  bind(container: Container): void {
    container.bind(AccountRepositorySymbol).to(AccountRepository).inSingletonScope();
    container.bind(AccountMapperSymbol).to(AccountMapper).inSingletonScope();
    container.bind(AccountServiceSymbol).to(AccountService).inSingletonScope();
    container.bind(AccountControllerSymbol).to(AccountController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AccountControllerSymbol;
  }
}
