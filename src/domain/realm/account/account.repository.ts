import {
  AccountEntity,
  AccountSchema,
  accountSchema,
} from '@/domain/realm/account/account.entity';
import { TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import { AbstractMongoRepository } from '@/abstract/AbstractMongoRepository';
import { Repository } from '@/infrastructure/core/stereotype.decorator';

export const AccountRepositorySymbol = Symbol.for('AccountRepository');

@Repository(AccountRepositorySymbol)
export class AccountRepository extends AbstractMongoRepository<AccountSchema> {
  constructor() {
    super(accountSchema, 'accounts');
  }

  @TraceAsync('account.repository.createAccount')
  async createAccount(
    dbName: string,
    email: string,
    password: string
  ): Promise<AccountEntity> {
    return this.create(dbName, {
      emails: [{ email, isPrimary: true }],
      password,
      isActive: true,
    });
  }

  @TraceAsync('account.repository.findByEmail')
  async findByEmail(
    dbName: string,
    email: string
  ): Promise<AccountEntity | null> {
    return this.findOne(dbName, { 'emails.email': email });
  }
}
