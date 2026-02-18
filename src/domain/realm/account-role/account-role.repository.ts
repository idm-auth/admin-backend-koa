import { AbstractCrudMongoRepository } from '@idm-auth/koa-inversify-framework/abstract';
import { Repository } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  AccountRoleSchema,
  accountRoleSchema,
} from '@/domain/realm/account-role/account-role.entity';

export const AccountRoleRepositorySymbol = Symbol.for('AccountRoleRepository');

@Repository(AccountRoleRepositorySymbol, { multiTenant: true })
export class AccountRoleRepository extends AbstractCrudMongoRepository<AccountRoleSchema> {
  constructor() {
    super(accountRoleSchema, 'account-role');
  }
}
