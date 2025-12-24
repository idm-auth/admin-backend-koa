import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { AccountRoleSchema, accountRoleSchema } from '@/domain/realm/account-role/account-role.entity';

export const AccountRoleRepositorySymbol = Symbol.for('AccountRoleRepository');

@Repository(AccountRoleRepositorySymbol, { multiTenant: true })
export class AccountRoleRepository extends AbstractMongoRepository<AccountRoleSchema> {
  constructor() {
    super(accountRoleSchema, 'account-roles');
  }
}
