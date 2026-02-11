import {
  AbstractCrudMapper,
  MapperSchemas,
} from '@idm-auth/koa-inversify-framework/abstract';
import { Mapper } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  GroupPolicyDtoTypes,
  groupPolicyBaseResponseSchema,
} from '@/domain/realm/group-policy/group-policy.dto';
import { GroupPolicySchema } from '@/domain/realm/group-policy/group-policy.entity';

export const GroupPolicyMapperSymbol = Symbol.for('GroupPolicyMapper');

@Mapper(GroupPolicyMapperSymbol)
export class GroupPolicyMapper extends AbstractCrudMapper<
  GroupPolicySchema,
  GroupPolicyDtoTypes
> {
  constructor() {
    const schemas: MapperSchemas<GroupPolicyDtoTypes> = {
      createResponseSchema: groupPolicyBaseResponseSchema,
      findByIdResponseSchema: groupPolicyBaseResponseSchema,
      findOneResponseSchema: groupPolicyBaseResponseSchema,
      updateResponseSchema: groupPolicyBaseResponseSchema,
      deleteResponseSchema: groupPolicyBaseResponseSchema,
      paginatedItemSchema: groupPolicyBaseResponseSchema,
    };
    super(schemas);
  }
}
