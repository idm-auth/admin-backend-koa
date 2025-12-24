import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import {
  AccountEntity,
  AccountSchema,
  accountSchema,
} from '@/domain/realm/account/account.entity';

export const AccountRepositorySymbol = Symbol.for('AccountRepository');

@Repository(AccountRepositorySymbol, { multiTenant: true })
export class AccountRepository extends AbstractMongoRepository<AccountSchema> {
  constructor() {
    super(accountSchema, 'accounts');
  }

  async findByEmail(email: string): Promise<AccountEntity | null> {
    return this.findOne({ 'emails.email': email });
  }
}
