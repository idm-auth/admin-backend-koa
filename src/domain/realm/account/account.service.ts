import { AbstractService } from '@/abstract/AbstractService';
import { AccountDtoTypes } from '@/domain/realm/account/account.dto';
import {
  Account,
  AccountEntity,
  AccountSchema,
} from '@/domain/realm/account/account.entity';
import {
  AccountMapper,
  AccountMapperSymbol,
} from '@/domain/realm/account/account.mapper';
import {
  AccountRepository,
  AccountRepositorySymbol,
} from '@/domain/realm/account/account.repository';
import { Service } from '@/infrastructure/core/stereotype/service.stereotype';
import { TraceAsync } from '@/infrastructure/telemetry/trace.decorator';
import bcrypt from 'bcrypt';
import { inject } from 'inversify';
import type {
  ApplyBasicCreateCasting,
  DeepPartial,
  Require_id,
  UpdateQuery,
} from 'mongoose';

export const AccountServiceSymbol = Symbol.for('AccountService');

@Service(AccountServiceSymbol)
export class AccountService extends AbstractService<
  AccountSchema,
  AccountDtoTypes
> {
  @inject(AccountRepositorySymbol) protected repository!: AccountRepository;
  @inject(AccountMapperSymbol) protected mapper!: AccountMapper;

  protected getServiceName(): string {
    return 'account';
  }

  protected buildCreateData(
    dto: AccountDtoTypes['CreateRequestDto']
  ): DeepPartial<ApplyBasicCreateCasting<Require_id<Account>>> {
    return {
      emails: [{ email: dto.email, isPrimary: true }],
      password: dto.password,
      isActive: true,
    };
  }

  protected buildUpdateQuery(
    data: AccountDtoTypes['UpdateRequestDto']
  ): UpdateQuery<Account> {
    return { $set: data };
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
