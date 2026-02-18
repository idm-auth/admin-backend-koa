import { AbstractMapper } from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import { LoginResponse } from '@/domain/realm/auth/auth.dto';
import { AccountEntity } from '@/domain/realm/account/account.entity';

export const AuthMapperSymbol = Symbol.for('AuthMapper');

@Mapper(AuthMapperSymbol)
export class AuthMapper extends AbstractMapper {
  toLoginResponse(
    account: AccountEntity,
    token: string,
    refreshToken: string
  ): LoginResponse {
    return {
      token,
      refreshToken,
      account: {
        _id: account._id.toString(),
        emails: account.emails.map((e) => ({
          email: e.email,
          isPrimary: e.isPrimary,
        })),
      },
    };
  }
}
