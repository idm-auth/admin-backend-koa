import { AbstractMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import { TraceAsync, MongoDB, MongoDBSymbol } from 'koa-inversify-framework';
import {
  AccountEntity,
  AccountSchema,
  accountSchema,
} from '@/domain/realm/account/account.entity';
import { inject } from 'inversify';

export const AccountRepositorySymbol = Symbol.for('AccountRepository');

@Repository(AccountRepositorySymbol)
export class AccountRepository extends AbstractMongoRepository<AccountSchema> {
  constructor(@inject(MongoDBSymbol) mongodb: MongoDB) {
    super(mongodb, accountSchema, 'accounts');
  }

  @TraceAsync('account.repository.createAccount')
  async createAccount(
    dbName: string,
    email: string,
    password: string
  ): Promise<AccountEntity> {
    const obj = {
      emails: [{ email, isPrimary: true }],
      password,
      isActive: true,
    };
    return this.create(dbName, obj);
  }

  @TraceAsync('account.repository.findByEmail')
  async findByEmail(
    dbName: string,
    email: string
  ): Promise<AccountEntity | null> {
    return this.findOne(dbName, { 'emails.email': email });
  }
}
