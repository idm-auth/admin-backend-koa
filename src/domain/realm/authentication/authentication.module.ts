import { AbstractModule } from 'koa-inversify-framework/abstract';
import { AuthenticationController, AuthenticationControllerSymbol } from '@/domain/realm/authentication/authentication.controller';
import { AuthenticationService, AuthenticationServiceSymbol } from '@/domain/realm/authentication/authentication.service';
import { AuthenticationMapper, AuthenticationMapperSymbol } from '@/domain/realm/authentication/authentication.mapper';

export class AuthenticationModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(AuthenticationMapperSymbol)
      .to(AuthenticationMapper)
      .inSingletonScope();
    this.container
      .bind(AuthenticationServiceSymbol)
      .to(AuthenticationService)
      .inSingletonScope();
    this.container
      .bind(AuthenticationControllerSymbol)
      .to(AuthenticationController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AuthenticationControllerSymbol;
  }
}
