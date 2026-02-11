import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  GroupPolicyController,
  GroupPolicyControllerSymbol,
} from '@/domain/realm/group-policy/group-policy.controller';
import {
  GroupPolicyMapper,
  GroupPolicyMapperSymbol,
} from '@/domain/realm/group-policy/group-policy.mapper';
import {
  GroupPolicyRepository,
  GroupPolicyRepositorySymbol,
} from '@/domain/realm/group-policy/group-policy.repository';
import {
  GroupPolicyService,
  GroupPolicyServiceSymbol,
} from '@/domain/realm/group-policy/group-policy.service';

export class GroupPolicyModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(GroupPolicyRepositorySymbol)
      .to(GroupPolicyRepository)
      .inSingletonScope();
    this.container
      .bind(GroupPolicyMapperSymbol)
      .to(GroupPolicyMapper)
      .inSingletonScope();
    this.container
      .bind(GroupPolicyServiceSymbol)
      .to(GroupPolicyService)
      .inSingletonScope();
    this.container
      .bind(GroupPolicyControllerSymbol)
      .to(GroupPolicyController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return GroupPolicyControllerSymbol;
  }
}
