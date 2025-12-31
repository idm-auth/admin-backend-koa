import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { inject } from 'inversify';
import jwt from 'jsonwebtoken';
import { ApplicationConfigurationService, ApplicationConfigurationServiceSymbol } from '@/domain/realm/application-configuration/application-configuration.service';
import { JwtPayload } from '@/domain/realm/jwt/jwt.dto';

export const JwtServiceSymbol = Symbol.for('JwtService');

@Service(JwtServiceSymbol, { multiTenant: true })
export class JwtService extends AbstractService {
  @inject(ApplicationConfigurationServiceSymbol)
  private appConfigService!: ApplicationConfigurationService;

  @TraceAsync('jwt.service.generateToken')
  async generateToken(payload: JwtPayload): Promise<string> {
    const config = await this.appConfigService.getBackendApiConfig();
    
    return jwt.sign(
      { ...payload, iat: Math.floor(Date.now() / 1000) },
      config.config.jwt.secret,
      { expiresIn: config.config.jwt.accessTokenExpiresIn } as jwt.SignOptions
    );
  }

  @TraceAsync('jwt.service.generateRefreshToken')
  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    const config = await this.appConfigService.getBackendApiConfig();
    
    return jwt.sign(
      { ...payload, iat: Math.floor(Date.now() / 1000) },
      config.config.jwt.secret,
      { expiresIn: config.config.jwt.refreshTokenExpiresIn } as jwt.SignOptions
    );
  }

  @TraceAsync('jwt.service.verifyToken')
  async verifyToken(token: string): Promise<JwtPayload> {
    const config = await this.appConfigService.getBackendApiConfig();
    
    return jwt.verify(token, config.config.jwt.secret) as JwtPayload;
  }
}
