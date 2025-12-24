import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { AccountGroupDtoTypes } from '@/domain/realm/account-group/account-group.dto';
import { AccountGroupEntity, AccountGroupSchema } from '@/domain/realm/account-group/account-group.entity';
import { AccountGroupRepository, AccountGroupRepositorySymbol } from '@/domain/realm/account-group/account-group.repository';
import { inject } from 'inversify';

export const AccountGroupServiceSymbol = Symbol.for('AccountGroupService');

@Service(AccountGroupServiceSymbol, { multiTenant: true })
export class AccountGroupService extends AbstractService<AccountGroupSchema, AccountGroupDtoTypes> {
  @inject(AccountGroupRepositorySymbol) protected repository!: AccountGroupRepository;

  protected buildCreateData(dto: AccountGroupDtoTypes['CreateRequestDto']): CreateInput<AccountGroupSchema> {
    return {
      accountId: dto.accountId,
      groupId: dto.groupId,
    };
  }

  protected buildUpdate(entity: AccountGroupEntity, dto: AccountGroupDtoTypes['UpdateRequestDto']): AccountGroupEntity {
    return entity;
  }
}
