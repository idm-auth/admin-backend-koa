import { AbstractMapper, MapperSchemas } from 'koa-inversify-framework/abstract';
import { Mapper } from 'koa-inversify-framework/stereotype';
import { AccountPolicyDtoTypes, accountPolicyBaseResponseSchema } from '@/domain/realm/account-policy/account-policy.dto';
import { AccountPolicySchema } from '@/domain/realm/account-policy/account-policy.entity';

export const AccountPolicyMapperSymbol = Symbol.for('AccountPolicyMapper');

@Mapper(AccountPolicyMapperSymbol)
export class AccountPolicyMapper extends AbstractMapper<AccountPolicySchema, AccountPolicyDtoTypes> {
  constructor() {
    const schemas: MapperSchemas<AccountPolicyDtoTypes> = {
      createResponseSchema: accountPolicyBaseResponseSchema,
      findByIdResponseSchema: accountPolicyBaseResponseSchema,
      findOneResponseSchema: accountPolicyBaseResponseSchema,
      updateResponseSchema: accountPolicyBaseResponseSchema,
      deleteResponseSchema: accountPolicyBaseResponseSchema,
      paginatedItemSchema: accountPolicyBaseResponseSchema,
    };
    super(schemas);
  }
}
