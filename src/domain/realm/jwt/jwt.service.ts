import { AbstractService } from '@idm-auth/koa-inversify-framework/abstract';
import { Service } from '@idm-auth/koa-inversify-framework/stereotype';
import { TraceAsync } from '@idm-auth/koa-inversify-framework/decorator';
import { inject } from 'inversify';
import jwt from 'jsonwebtoken';
import {
  SystemSetupService,
  SystemSetupServiceSymbol,
} from '@/domain/realm/system-setup/system-setup.service';
import { JwtPayload } from '@/domain/realm/jwt/jwt.dto';

export const JwtServiceSymbol = Symbol.for('JwtService');

@Service(JwtServiceSymbol, { multiTenant: true })
export class JwtService extends AbstractService {
  @inject(SystemSetupServiceSymbol)
  private systemSetupService!: SystemSetupService;

  @TraceAsync('jwt.service.generateToken')
  async generateToken(payload: JwtPayload): Promise<string> {
    const config = await this.systemSetupService.getJwtConfig();

    return jwt.sign(
      { ...payload, iat: Math.floor(Date.now() / 1000) },
      config.secret,
      { expiresIn: config.accessTokenExpiresIn } as jwt.SignOptions
    );
  }

  @TraceAsync('jwt.service.generateRefreshToken')
  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const config = await this.systemSetupService.getJwtConfig();

    return jwt.sign(
      { ...payload, iat: Math.floor(Date.now() / 1000) },
      config.secret,
      { expiresIn: config.refreshTokenExpiresIn } as jwt.SignOptions
    );
  }

  @TraceAsync('jwt.service.verifyToken')
  async verifyToken(token: string): Promise<JwtPayload> {
    const config = await this.systemSetupService.getJwtConfig();

    return jwt.verify(token, config.secret) as JwtPayload;
  }
}
