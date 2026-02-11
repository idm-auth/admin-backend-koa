import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  AccountGroupDtoTypes,
  accountGroupBaseResponseSchema,
} from '@/domain/realm/account-group/account-group.dto';
import { AccountGroupSchema } from '@/domain/realm/account-group/account-group.entity';

export const AccountGroupMapperSymbol = Symbol.for('AccountGroupMapper');

@Mapper(AccountGroupMapperSymbol)
export class AccountGroupMapper extends AbstractCrudMapper<
  AccountGroupSchema,
  AccountGroupDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<AccountGroupDtoTypes> = {
      createResponseSchema: accountGroupBaseResponseSchema,
      findByIdResponseSchema: accountGroupBaseResponseSchema,
      findOneResponseSchema: accountGroupBaseResponseSchema,
      updateResponseSchema: accountGroupBaseResponseSchema,
      deleteResponseSchema: accountGroupBaseResponseSchema,
      paginatedItemSchema: accountGroupBaseResponseSchema,
    };
    super(schemas);
  }
}
