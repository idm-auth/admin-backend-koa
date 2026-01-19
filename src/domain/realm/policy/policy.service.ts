import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { PolicyDtoTypes } from '@/domain/realm/policy/policy.dto';
import { PolicyCreate, PolicyEntity, PolicySchema } from '@/domain/realm/policy/policy.entity';
import { PolicyRepository, PolicyRepositorySymbol } from '@/domain/realm/policy/policy.repository';
import { inject } from 'inversify';

export const PolicyServiceSymbol = Symbol.for('PolicyService');

@Service(PolicyServiceSymbol, { multiTenant: true })
export class PolicyService extends AbstractCrudService<PolicySchema, PolicyDtoTypes, PolicyCreate> {
  @inject(PolicyRepositorySymbol) protected repository!: PolicyRepository;

  protected buildCreateDataFromDto(dto: PolicyDtoTypes['CreateRequestDto']): PolicyCreate {
    return {
      version: dto.version || '2025-12-24',
      name: dto.name,
      description: dto.description,
      effect: dto.effect,
      actions: dto.actions.map((action) => this.parseAction(action)),
      resources: dto.resources.map((resource) => this.parseResource(resource)),
    };
  }

  protected buildUpdate(entity: PolicyEntity, dto: PolicyDtoTypes['UpdateRequestDto']): PolicyEntity {
    if (dto.version !== undefined) entity.version = dto.version;
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined) entity.description = dto.description;
    if (dto.effect !== undefined) entity.effect = dto.effect;
    if (dto.actions !== undefined) entity.actions = dto.actions.map((action) => this.parseAction(action));
    if (dto.resources !== undefined) entity.resources = dto.resources.map((resource) => this.parseResource(resource));
    return entity;
  }

  private parseAction(action: string) {
    const [system, resource, operation] = action.split(':');
    return { system, resource, operation };
  }

  private parseResource(resource: string) {
    const [, partition, system, region, tenantId, ...resourcePathParts] = resource.split(':');
    return {
      partition,
      system,
      region,
      tenantId,
      resourcePath: resourcePathParts.join(':'),
    };
  }
}
