import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  PolicyActionController,
  PolicyActionControllerSymbol,
} from '@/domain/realm/policy-action/policy-action.controller';
import {
  PolicyActionMapper,
  PolicyActionMapperSymbol,
} from '@/domain/realm/policy-action/policy-action.mapper';
import {
  PolicyActionRepository,
  PolicyActionRepositorySymbol,
} from '@/domain/realm/policy-action/policy-action.repository';
import {
  PolicyActionService,
  PolicyActionServiceSymbol,
} from '@/domain/realm/policy-action/policy-action.service';

export class PolicyActionModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(PolicyActionRepositorySymbol)
      .to(PolicyActionRepository)
      .inSingletonScope();
    this.container
      .bind(PolicyActionMapperSymbol)
      .to(PolicyActionMapper)
      .inSingletonScope();
    this.container
      .bind(PolicyActionServiceSymbol)
      .to(PolicyActionService)
      .inSingletonScope();
    this.container
      .bind(PolicyActionControllerSymbol)
      .to(PolicyActionController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return PolicyActionControllerSymbol;
  }
}
