import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { UnauthorizedError, NotFoundError } from 'koa-inversify-framework/error';
import { inject } from 'inversify';
import { AccountService, AccountServiceSymbol } from '@/domain/realm/account/account.service';
import { LoginRequest, LoginResponse } from '@/domain/realm/authentication/authentication.dto';
import { AuthenticationMapper, AuthenticationMapperSymbol } from '@/domain/realm/authentication/authentication.mapper';
import { JwtService, JwtServiceSymbol } from '@/domain/realm/jwt/jwt.service';

export const AuthenticationServiceSymbol = Symbol.for('AuthenticationService');

@Service(AuthenticationServiceSymbol, { multiTenant: true })
export class AuthenticationService extends AbstractService {
  @inject(AccountServiceSymbol) private accountService!: AccountService;
  @inject(AuthenticationMapperSymbol) private mapper!: AuthenticationMapper;
  @inject(JwtServiceSymbol) private jwtService!: JwtService;

  @TraceAsync('authentication.service.login')
  async login(data: LoginRequest): Promise<LoginResponse> {
    this.log.info({ email: data.email }, 'Login attempt');

    try {
      const account = await this.accountService.findByEmail(data.email);
      const isValid = await this.accountService.comparePassword(account, data.password);

      if (!isValid) {
        this.log.warn({ email: data.email }, 'Invalid password');
        throw new UnauthorizedError('Invalid email or password');
      }

      this.log.info({ accountId: account._id }, 'Login successful');

      const token = await this.jwtService.generateToken({ accountId: account._id.toString() });
      const refreshToken = await this.jwtService.generateRefreshToken({ accountId: account._id.toString() });

      return this.mapper.toLoginResponse(account, token, refreshToken);
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.log.warn({ email: data.email }, 'Account not found');
        throw new UnauthorizedError('Invalid email or password');
      }
      throw error;
    }
  }

  @TraceAsync('authentication.service.validateToken')
  async validateToken(token: string): Promise<{ valid: boolean; accountId?: string }> {
    try {
      const payload = await this.jwtService.verifyToken(token);
      return { valid: true, accountId: payload.accountId };
    } catch (error) {
      this.log.debug({ error }, 'Token validation failed');
      return { valid: false };
    }
  }
}
