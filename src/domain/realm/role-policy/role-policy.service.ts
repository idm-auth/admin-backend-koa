import { AbstractService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { CreateInput } from 'koa-inversify-framework/common';
import { RolePolicyDtoTypes } from '@/domain/realm/role-policy/role-policy.dto';
import { RolePolicyEntity, RolePolicySchema } from '@/domain/realm/role-policy/role-policy.entity';
import { RolePolicyRepository, RolePolicyRepositorySymbol } from '@/domain/realm/role-policy/role-policy.repository';
import { inject } from 'inversify';

export const RolePolicyServiceSymbol = Symbol.for('RolePolicyService');

@Service(RolePolicyServiceSymbol, { multiTenant: true })
export class RolePolicyService extends AbstractService<RolePolicySchema, RolePolicyDtoTypes> {
  @inject(RolePolicyRepositorySymbol) protected repository!: RolePolicyRepository;

  protected buildCreateData(dto: RolePolicyDtoTypes['CreateRequestDto']): CreateInput<RolePolicySchema> {
    return {
      roleId: dto.roleId,
      policyId: dto.policyId,
    };
  }

  protected buildUpdate(entity: RolePolicyEntity, dto: RolePolicyDtoTypes['UpdateRequestDto']): RolePolicyEntity {
    return entity;
  }
}
