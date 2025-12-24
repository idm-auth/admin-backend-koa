import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { AccountGroupSchema, accountGroupSchema } from '@/domain/realm/account-group/account-group.entity';

export const AccountGroupRepositorySymbol = Symbol.for('AccountGroupRepository');

@Repository(AccountGroupRepositorySymbol, { multiTenant: true })
export class AccountGroupRepository extends AbstractMongoRepository<AccountGroupSchema> {
  constructor() {
    super(accountGroupSchema, 'account-groups');
  }
}
