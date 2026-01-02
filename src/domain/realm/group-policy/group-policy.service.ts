import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { GroupPolicyDtoTypes } from '@/domain/realm/group-policy/group-policy.dto';
import { GroupPolicyCreate, GroupPolicyEntity, GroupPolicySchema } from '@/domain/realm/group-policy/group-policy.entity';
import { GroupPolicyRepository, GroupPolicyRepositorySymbol } from '@/domain/realm/group-policy/group-policy.repository';
import { inject } from 'inversify';

export const GroupPolicyServiceSymbol = Symbol.for('GroupPolicyService');

@Service(GroupPolicyServiceSymbol, { multiTenant: true })
export class GroupPolicyService extends AbstractCrudService<GroupPolicySchema, GroupPolicyDtoTypes, GroupPolicyCreate> {
  @inject(GroupPolicyRepositorySymbol) protected repository!: GroupPolicyRepository;

  protected buildCreateDataFromDto(dto: GroupPolicyDtoTypes['CreateRequestDto']): GroupPolicyCreate {
    return {
      groupId: dto.groupId,
      policyId: dto.policyId,
    };
  }

  protected buildUpdate(entity: GroupPolicyEntity, dto: GroupPolicyDtoTypes['UpdateRequestDto']): GroupPolicyEntity {
    return entity;
  }
}
