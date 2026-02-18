import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  AccountPolicyDtoTypes,
  accountPolicyBaseResponseSchema,
} from '@/domain/realm/account-policy/account-policy.dto';
import { AccountPolicySchema } from '@/domain/realm/account-policy/account-policy.entity';

export const AccountPolicyMapperSymbol = Symbol.for('AccountPolicyMapper');

@Mapper(AccountPolicyMapperSymbol)
export class AccountPolicyMapper extends AbstractCrudMapper<
  AccountPolicySchema,
  AccountPolicyDtoTypes
> {
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
