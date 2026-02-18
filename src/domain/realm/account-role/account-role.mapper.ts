import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  AccountRoleDtoTypes,
  accountRoleBaseResponseSchema,
} from '@/domain/realm/account-role/account-role.dto';
import { AccountRoleSchema } from '@/domain/realm/account-role/account-role.entity';

export const AccountRoleMapperSymbol = Symbol.for('AccountRoleMapper');

@Mapper(AccountRoleMapperSymbol)
export class AccountRoleMapper extends AbstractCrudMapper<
  AccountRoleSchema,
  AccountRoleDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<AccountRoleDtoTypes> = {
      createResponseSchema: accountRoleBaseResponseSchema,
      findByIdResponseSchema: accountRoleBaseResponseSchema,
      findOneResponseSchema: accountRoleBaseResponseSchema,
      updateResponseSchema: accountRoleBaseResponseSchema,
      deleteResponseSchema: accountRoleBaseResponseSchema,
      paginatedItemSchema: accountRoleBaseResponseSchema,
    };
    super(schemas);
  }
}
