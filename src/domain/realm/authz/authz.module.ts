import { AbstractModule } from '@idm-auth/koa-inversify-framework/abstract';
import {
  AuthzController,
  AuthzControllerSymbol,
} from '@/domain/realm/authz/authz.controller';
import {
  AuthzService,
  AuthzServiceSymbol,
} from '@/domain/realm/authz/authz.service';
import {
  AuthzMapper,
  AuthzMapperSymbol,
} from '@/domain/realm/authz/authz.mapper';

export class AuthzModule extends AbstractModule {
  protected runBind(): void {
    this.container.bind(AuthzMapperSymbol).to(AuthzMapper).inSingletonScope();
    this.container.bind(AuthzServiceSymbol).to(AuthzService).inSingletonScope();
    this.container
      .bind(AuthzControllerSymbol)
      .to(AuthzController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AuthzControllerSymbol;
  }
}
