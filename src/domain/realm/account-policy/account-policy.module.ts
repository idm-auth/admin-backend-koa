import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  AccountPolicyController,
  AccountPolicyControllerSymbol,
} from '@/domain/realm/account-policy/account-policy.controller';
import {
  AccountPolicyMapper,
  AccountPolicyMapperSymbol,
} from '@/domain/realm/account-policy/account-policy.mapper';
import {
  AccountPolicyRepository,
  AccountPolicyRepositorySymbol,
} from '@/domain/realm/account-policy/account-policy.repository';
import {
  AccountPolicyService,
  AccountPolicyServiceSymbol,
} from '@/domain/realm/account-policy/account-policy.service';

export class AccountPolicyModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(AccountPolicyRepositorySymbol)
      .to(AccountPolicyRepository)
      .inSingletonScope();
    this.container
      .bind(AccountPolicyMapperSymbol)
      .to(AccountPolicyMapper)
      .inSingletonScope();
    this.container
      .bind(AccountPolicyServiceSymbol)
      .to(AccountPolicyService)
      .inSingletonScope();
    this.container
      .bind(AccountPolicyControllerSymbol)
      .to(AccountPolicyController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AccountPolicyControllerSymbol;
  }
}
