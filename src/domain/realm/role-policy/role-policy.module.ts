import { AbstractModule } from 'koa-inversify-framework/abstract';
import { RolePolicyController, RolePolicyControllerSymbol } from '@/domain/realm/role-policy/role-policy.controller';
import { RolePolicyMapper, RolePolicyMapperSymbol } from '@/domain/realm/role-policy/role-policy.mapper';
import { RolePolicyRepository, RolePolicyRepositorySymbol } from '@/domain/realm/role-policy/role-policy.repository';
import { RolePolicyService, RolePolicyServiceSymbol } from '@/domain/realm/role-policy/role-policy.service';

export class RolePolicyModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(RolePolicyRepositorySymbol).to(RolePolicyRepository).inSingletonScope();
    this.container.bind(RolePolicyMapperSymbol).to(RolePolicyMapper).inSingletonScope();
    this.container.bind(RolePolicyServiceSymbol).to(RolePolicyService).inSingletonScope();
    this.container.bind(RolePolicyControllerSymbol).to(RolePolicyController).inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return RolePolicyControllerSymbol;
  }
}
