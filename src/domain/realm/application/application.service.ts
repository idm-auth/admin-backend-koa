import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { CreateInput } from 'koa-inversify-framework/common';
import { ApplicationDtoTypes } from '@/domain/realm/application/application.dto';
import { ApplicationEntity, ApplicationSchema } from '@/domain/realm/application/application.entity';
import { ApplicationRepository, ApplicationRepositorySymbol } from '@/domain/realm/application/application.repository';
import { inject } from 'inversify';

export const ApplicationServiceSymbol = Symbol.for('ApplicationService');

@Service(ApplicationServiceSymbol, { multiTenant: true })
export class ApplicationService extends AbstractCrudService<ApplicationSchema, ApplicationDtoTypes> {
  @inject(ApplicationRepositorySymbol) protected repository!: ApplicationRepository;

  protected buildCreateData(dto: ApplicationDtoTypes['CreateRequestDto']): CreateInput<ApplicationSchema> {
    return {
      name: dto.name,
      systemId: dto.systemId,
      availableActions: dto.availableActions,
      isActive: true,
    };
  }

  protected buildUpdate(entity: ApplicationEntity, dto: ApplicationDtoTypes['UpdateRequestDto']): ApplicationEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.availableActions !== undefined) entity.availableActions = dto.availableActions;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  @TraceAsync('application.service.findBySystemId')
  async findBySystemId(systemId: string): Promise<ApplicationEntity> {
    return this.repository.findBySystemId(systemId);
  }
}
