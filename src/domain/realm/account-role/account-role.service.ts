import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { AccountRoleDtoTypes } from '@/domain/realm/account-role/account-role.dto';
import { AccountRoleEntity, AccountRoleSchema, AccountRoleCreate } from '@/domain/realm/account-role/account-role.entity';
import { AccountRoleRepository, AccountRoleRepositorySymbol } from '@/domain/realm/account-role/account-role.repository';
import { PaginationFilter } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const AccountRoleServiceSymbol = Symbol.for('AccountRoleService');

@Service(AccountRoleServiceSymbol, { multiTenant: true })
export class AccountRoleService extends AbstractCrudService<AccountRoleSchema, AccountRoleDtoTypes, AccountRoleCreate> {
  @inject(AccountRoleRepositorySymbol) protected repository!: AccountRoleRepository;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<AccountRoleSchema>> {
    return {};
  }

  protected buildCreateDataFromDto(dto: AccountRoleDtoTypes['CreateRequestDto']): AccountRoleCreate {
    return {
      accountId: dto.accountId,
      roleId: dto.roleId,
    };
  }

  protected buildUpdate(entity: AccountRoleEntity, dto: AccountRoleDtoTypes['UpdateRequestDto']): AccountRoleEntity {
    return entity;
  }
}
