import { AbstractMapper } from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';

export const AuthzMapperSymbol = Symbol.for('AuthzMapper');

@Mapper(AuthzMapperSymbol)
export class AuthzMapper extends AbstractMapper {
  // Mapper methods if needed
}
