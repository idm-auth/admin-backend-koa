import { AbstractMapper, MapperSchemas } from '@/abstract/AbstractMapper';
import {
  AccountDtoTypes,
  accountCreateResponseSchema,
  accountListItemResponseSchema,
  accountReadResponseSchema,
  accountUpdateResponseSchema,
} from '@/domain/realm/account/account.dto';
import { AccountSchema } from '@/domain/realm/account/account.entity';
import { Mapper } from '@/infrastructure/core/stereotype/mapper.stereotype';

export const AccountMapperSymbol = Symbol.for('AccountMapper');

@Mapper(AccountMapperSymbol)
export class AccountMapper extends AbstractMapper<
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
      paginatedResponseSchema: accountListItemResponseSchema,
    };
    super(schemas);
  }
}
