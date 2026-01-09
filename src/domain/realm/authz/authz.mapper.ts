import { AbstractMapper } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';

export const AuthzMapperSymbol = Symbol.for('AuthzMapper');

@Mapper(AuthzMapperSymbol)
export class AuthzMapper extends AbstractMapper {
  // Mapper methods if needed
}
