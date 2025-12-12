import { AbstractMongoRepository } from '@/abstract/AbstractMongoRepository';
import {
  AccountEntity,
  AccountSchema,
  accountSchema,
} from '@/domain/realm/account/account.entity';
import { Repository } from '@/infrastructure/core/stereotype.decorator';
import { TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import { inject } from 'inversify';
import { MongoDB, MongoDBSymbol } from '@/infrastructure/mongodb/mongodb.provider';

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
