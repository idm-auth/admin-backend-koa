import { AbstractModule } from 'koa-inversify-framework/abstract';
import { PolicyController, PolicyControllerSymbol } from '@/domain/realm/policy/policy.controller';
import { PolicyMapper, PolicyMapperSymbol } from '@/domain/realm/policy/policy.mapper';
import { PolicyRepository, PolicyRepositorySymbol } from '@/domain/realm/policy/policy.repository';
import { PolicyService, PolicyServiceSymbol } from '@/domain/realm/policy/policy.service';

export class PolicyModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(PolicyRepositorySymbol).to(PolicyRepository).inSingletonScope();
    this.container.bind(PolicyMapperSymbol).to(PolicyMapper).inSingletonScope();
    this.container.bind(PolicyServiceSymbol).to(PolicyService).inSingletonScope();
    this.container.bind(PolicyControllerSymbol).to(PolicyController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return PolicyControllerSymbol;
  }
}
