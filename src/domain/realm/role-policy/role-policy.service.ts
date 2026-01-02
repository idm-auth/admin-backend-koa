import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { RolePolicyDtoTypes } from '@/domain/realm/role-policy/role-policy.dto';
import { RolePolicyCreate, RolePolicyEntity, RolePolicySchema } from '@/domain/realm/role-policy/role-policy.entity';
import { RolePolicyRepository, RolePolicyRepositorySymbol } from '@/domain/realm/role-policy/role-policy.repository';
import { inject } from 'inversify';

export const RolePolicyServiceSymbol = Symbol.for('RolePolicyService');

@Service(RolePolicyServiceSymbol, { multiTenant: true })
export class RolePolicyService extends AbstractCrudService<RolePolicySchema, RolePolicyDtoTypes, RolePolicyCreate> {
  @inject(RolePolicyRepositorySymbol) protected repository!: RolePolicyRepository;

  protected buildCreateDataFromDto(dto: RolePolicyDtoTypes['CreateRequestDto']): RolePolicyCreate {
    return {
      roleId: dto.roleId,
      policyId: dto.policyId,
    };
  }

  protected buildUpdate(entity: RolePolicyEntity, dto: RolePolicyDtoTypes['UpdateRequestDto']): RolePolicyEntity {
    return entity;
  }
}
