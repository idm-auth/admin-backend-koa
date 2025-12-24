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
import { ConflictError, NotFoundError, ValidationError } from 'koa-inversify-framework/error';

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

  protected async beforeCreate(dto: AccountDtoTypes['CreateRequestDto']): Promise<void> {
    await this.validateEmailUnique(dto.email);
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

  @TraceAsync('account.service.validateEmailUnique')
  async validateEmailUnique(email: string): Promise<void> {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email already exists');
    }
  }

  @TraceAsync('account.service.resetPassword')
  async resetPassword(id: string, password: string): Promise<AccountEntity> {
    this.log.debug({ id }, 'Resetting password');
    const account = await this.findById(id);
    account.password = password;
    return account.save();
  }

  @TraceAsync('account.service.updatePassword')
  async updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<AccountEntity> {
    this.log.debug({ id }, 'Updating password');
    const account = await this.findById(id);
    const isValid = await this.comparePassword(account, currentPassword);
    if (!isValid) {
      throw new ValidationError('Current password is incorrect');
    }
    account.password = newPassword;
    return account.save();
  }

  @TraceAsync('account.service.addEmail')
  async addEmail(id: string, email: string): Promise<AccountEntity> {
    this.log.debug({ id, email }, 'Adding email');
    await this.validateEmailUnique(email);
    const account = await this.findById(id);
    const emailExists = account.emails.some((e) => e.email === email);
    if (emailExists) {
      throw new ConflictError('Email already exists in this account');
    }
    account.emails.push({ email, isPrimary: false });
    return account.save();
  }

  @TraceAsync('account.service.removeEmail')
  async removeEmail(id: string, email: string): Promise<AccountEntity> {
    this.log.debug({ id, email }, 'Removing email');
    const account = await this.findById(id);
    if (account.emails.length <= 1) {
      throw new ValidationError('Cannot remove the only email from account');
    }
    const emailToRemove = account.emails.find((e) => e.email === email);
    if (!emailToRemove) {
      throw new NotFoundError('Email not found in this account');
    }
    account.emails.pull(emailToRemove);
    return account.save();
  }

  @TraceAsync('account.service.setPrimaryEmail')
  async setPrimaryEmail(id: string, email: string): Promise<AccountEntity> {
    this.log.debug({ id, email }, 'Setting primary email');
    const account = await this.findById(id);
    const emailExists = account.emails.some((e) => e.email === email);
    if (!emailExists) {
      throw new NotFoundError('Email not found in this account');
    }
    account.emails.forEach((e) => {
      e.isPrimary = e.email === email;
    });
    return account.save();
  }

  @TraceAsync('account.service.setActiveStatus')
  async setActiveStatus(id: string, isActive: boolean): Promise<AccountEntity> {
    this.log.debug({ id, isActive }, 'Setting active status');
    const account = await this.findById(id);
    account.isActive = isActive;
    return account.save();
  }
}
