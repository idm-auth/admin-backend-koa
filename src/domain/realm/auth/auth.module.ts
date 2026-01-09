import { AbstractModule } from 'koa-inversify-framework/abstract';
import { AuthController, AuthControllerSymbol } from '@/domain/realm/auth/auth.controller';
import { AuthService, AuthServiceSymbol } from '@/domain/realm/auth/auth.service';
import { AuthMapper, AuthMapperSymbol } from '@/domain/realm/auth/auth.mapper';

export class AuthModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(AuthMapperSymbol)
      .to(AuthMapper)
      .inSingletonScope();
    this.container
      .bind(AuthServiceSymbol)
      .to(AuthService)
      .inSingletonScope();
    this.container
      .bind(AuthControllerSymbol)
      .to(AuthController)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol {
    return AuthControllerSymbol;
  }
}
