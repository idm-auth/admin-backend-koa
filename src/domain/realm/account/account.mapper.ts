import { AbstractCrudMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import {
  AccountDtoTypes,
  accountCreateResponseSchema,
  accountListItemResponseSchema,
  accountReadResponseSchema,
  accountUpdateResponseSchema,
} from '@/domain/realm/account/account.dto';
import { AccountSchema } from '@/domain/realm/account/account.entity';

export const AccountMapperSymbol = Symbol.for('AccountMapper');

@Mapper(AccountMapperSymbol)
export class AccountMapper extends AbstractCrudMapper<
  AccountSchema,
  AccountDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<AccountDtoTypes> = {
      createResponseSchema: accountCreateResponseSchema,
      findByIdResponseSchema: accountReadResponseSchema,
      findOneResponseSchema: accountReadResponseSchema,
      updateResponseSchema: accountUpdateResponseSchema,
      deleteResponseSchema: accountReadResponseSchema,
      paginatedItemSchema: accountListItemResponseSchema,
    };
    super(schemas);
  }
}
