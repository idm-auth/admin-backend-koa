import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { AccountPolicySchema, accountPolicySchema } from '@/domain/realm/account-policy/account-policy.entity';

export const AccountPolicyRepositorySymbol = Symbol.for('AccountPolicyRepository');

@Repository(AccountPolicyRepositorySymbol, { multiTenant: true })
export class AccountPolicyRepository extends AbstractCrudMongoRepository<AccountPolicySchema> {
  constructor() {
    super(accountPolicySchema, 'account-policies');
  }
}
