import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { GroupPolicyDtoTypes } from '@/domain/realm/group-policy/group-policy.dto';
import { GroupPolicyEntity, GroupPolicySchema } from '@/domain/realm/group-policy/group-policy.entity';
import { GroupPolicyRepository, GroupPolicyRepositorySymbol } from '@/domain/realm/group-policy/group-policy.repository';
import { inject } from 'inversify';

export const GroupPolicyServiceSymbol = Symbol.for('GroupPolicyService');

@Service(GroupPolicyServiceSymbol, { multiTenant: true })
export class GroupPolicyService extends AbstractService<GroupPolicySchema, GroupPolicyDtoTypes> {
  @inject(GroupPolicyRepositorySymbol) protected repository!: GroupPolicyRepository;

  protected buildCreateData(dto: GroupPolicyDtoTypes['CreateRequestDto']): CreateInput<GroupPolicySchema> {
    return {
      groupId: dto.groupId,
      policyId: dto.policyId,
    };
  }

  protected buildUpdate(entity: GroupPolicyEntity, dto: GroupPolicyDtoTypes['UpdateRequestDto']): GroupPolicyEntity {
    return entity;
  }
}
