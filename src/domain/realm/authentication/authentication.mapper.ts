import { AbstractMapper } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { LoginResponse } from '@/domain/realm/authentication/authentication.dto';
import { AccountEntity } from '@/domain/realm/account/account.entity';

export const AuthenticationMapperSymbol = Symbol.for('AuthenticationMapper');

@Mapper(AuthenticationMapperSymbol)
export class AuthenticationMapper extends AbstractMapper {
  toLoginResponse(account: AccountEntity, token: string, refreshToken: string): LoginResponse {
    return {
      token,
      refreshToken,
      account: {
        _id: account._id.toString(),
        emails: account.emails.map(e => ({
          email: e.email,
          isPrimary: e.isPrimary,
        })),
      },
    };
  }
}
