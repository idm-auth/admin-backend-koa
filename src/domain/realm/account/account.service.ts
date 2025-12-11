import { inject } from 'inversify';
import { TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import { AbstractService } from '@/abstract/AbstractService';
import {
  AccountRepository,
  AccountRepositorySymbol,
} from '@/domain/realm/account/account.repository';
import { AccountEntity } from '@/domain/realm/account/account.entity';
import { Service } from '@/infrastructure/core/stereotype.decorator';
import bcrypt from 'bcrypt';

export const AccountServiceSymbol = Symbol.for('AccountService');

@Service(AccountServiceSymbol)
export class AccountService extends AbstractService<
  AccountEntity,
  AccountEntity,
  { email: string; password: string }
> {
  @inject(AccountRepositorySymbol) protected repository!: AccountRepository;
  protected mapper = {
    toDto: (entity: AccountEntity) => entity,
    toDtoList: (entities: AccountEntity[]) => entities,
  };

  protected getServiceName(): string {
    return 'account';
  }

  @TraceAsync('account.service.findByEmail')
  async findByEmail(
    dbName: string,
    email: string
  ): Promise<AccountEntity | null> {
    return this.repository.findByEmail(dbName, email);
  }

  @TraceAsync('account.service.comparePassword')
  async comparePassword(
    account: AccountEntity,
    password: string
  ): Promise<boolean> {
    return bcrypt.compare(password, account.password);
  }
}
