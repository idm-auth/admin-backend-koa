import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { CreateInput } from 'koa-inversify-framework/common';
import { AccountDtoTypes } from '@/domain/realm/account/account.dto';
import {
  AccountEntity,
  AccountSchema,
} from '@/domain/realm/account/account.entity';
import {
  AccountRepository,
  AccountRepositorySymbol,
} from '@/domain/realm/account/account.repository';
import bcrypt from 'bcrypt';
import { inject } from 'inversify';

export const AccountServiceSymbol = Symbol.for('AccountService');

@Service(AccountServiceSymbol, { multiTenant: true })
export class AccountService extends AbstractService<
  AccountSchema,
  AccountDtoTypes
> {
  @inject(AccountRepositorySymbol) protected repository!: AccountRepository;

  protected buildCreateData(
    dto: AccountDtoTypes['CreateRequestDto']
  ): CreateInput<AccountSchema> {
    this.log.debug({ dto }, 'Building create data');
    return {
      emails: [{ email: dto.email, isPrimary: true }],
      password: dto.password,
      isActive: true,
    };
  }

  protected buildUpdate(
    entity: AccountEntity,
    dto: AccountDtoTypes['UpdateRequestDto']
  ): AccountEntity {
    this.log.debug({ id: entity._id, dto }, 'Building update');
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  @TraceAsync('account.service.findByEmail')
  async findByEmail(email: string): Promise<AccountEntity | null> {
    this.log.debug({ email }, 'Finding by email');
    return this.repository.findByEmail(email);
  }

  @TraceAsync('account.service.comparePassword')
  async comparePassword(
    account: AccountEntity,
    password: string
  ): Promise<boolean> {
    this.log.debug({ accountId: account._id }, 'Comparing password');
    return bcrypt.compare(password, account.password);
  }
}
