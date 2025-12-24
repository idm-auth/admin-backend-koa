import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { AccountRoleDtoTypes } from '@/domain/realm/account-role/account-role.dto';
import { AccountRoleEntity, AccountRoleSchema } from '@/domain/realm/account-role/account-role.entity';
import { AccountRoleRepository, AccountRoleRepositorySymbol } from '@/domain/realm/account-role/account-role.repository';
import { inject } from 'inversify';

export const AccountRoleServiceSymbol = Symbol.for('AccountRoleService');

@Service(AccountRoleServiceSymbol, { multiTenant: true })
export class AccountRoleService extends AbstractService<AccountRoleSchema, AccountRoleDtoTypes> {
  @inject(AccountRoleRepositorySymbol) protected repository!: AccountRoleRepository;

  protected buildCreateData(dto: AccountRoleDtoTypes['CreateRequestDto']): CreateInput<AccountRoleSchema> {
    return {
      accountId: dto.accountId,
      roleId: dto.roleId,
    };
  }

  protected buildUpdate(entity: AccountRoleEntity, dto: AccountRoleDtoTypes['UpdateRequestDto']): AccountRoleEntity {
    return entity;
  }
}
