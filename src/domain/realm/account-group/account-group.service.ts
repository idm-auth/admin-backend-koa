import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { AccountGroupDtoTypes } from '@/domain/realm/account-group/account-group.dto';
import { AccountGroupEntity, AccountGroupSchema, AccountGroupCreate } from '@/domain/realm/account-group/account-group.entity';
import { AccountGroupRepository, AccountGroupRepositorySymbol } from '@/domain/realm/account-group/account-group.repository';
import { inject } from 'inversify';

export const AccountGroupServiceSymbol = Symbol.for('AccountGroupService');

@Service(AccountGroupServiceSymbol, { multiTenant: true })
export class AccountGroupService extends AbstractCrudService<AccountGroupSchema, AccountGroupDtoTypes, AccountGroupCreate> {
  @inject(AccountGroupRepositorySymbol) protected repository!: AccountGroupRepository;

  protected buildCreateDataFromDto(dto: AccountGroupDtoTypes['CreateRequestDto']): AccountGroupCreate {
    return {
      accountId: dto.accountId,
      groupId: dto.groupId,
    };
  }

  protected buildUpdate(entity: AccountGroupEntity, dto: AccountGroupDtoTypes['UpdateRequestDto']): AccountGroupEntity {
    return entity;
  }
}
