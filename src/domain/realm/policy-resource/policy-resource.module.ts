import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  PolicyResourceController,
  PolicyResourceControllerSymbol,
} from '@/domain/realm/policy-resource/policy-resource.controller';
import {
  PolicyResourceMapper,
  PolicyResourceMapperSymbol,
} from '@/domain/realm/policy-resource/policy-resource.mapper';
import {
  PolicyResourceRepository,
  PolicyResourceRepositorySymbol,
} from '@/domain/realm/policy-resource/policy-resource.repository';
import {
  PolicyResourceService,
  PolicyResourceServiceSymbol,
} from '@/domain/realm/policy-resource/policy-resource.service';

export class PolicyResourceModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(PolicyResourceRepositorySymbol)
      .to(PolicyResourceRepository)
      .inSingletonScope();
    this.container
      .bind(PolicyResourceMapperSymbol)
      .to(PolicyResourceMapper)
      .inSingletonScope();
    this.container
      .bind(PolicyResourceServiceSymbol)
      .to(PolicyResourceService)
      .inSingletonScope();
    this.container
      .bind(PolicyResourceControllerSymbol)
      .to(PolicyResourceController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return PolicyResourceControllerSymbol;
  }
}
