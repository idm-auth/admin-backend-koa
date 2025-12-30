import { AbstractModule } from 'koa-inversify-framework/abstract';
import { JwtService, JwtServiceSymbol } from '@/domain/realm/jwt/jwt.service';

export class JwtModule extends AbstractModule {
  protected runBind(): void {
    this.container
      .bind(JwtServiceSymbol)
      .to(JwtService)
      .inSingletonScope();
  }

  getControllerSymbol(): symbol | undefined {
    return undefined;
  }
}
