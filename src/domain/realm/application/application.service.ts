import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { ApplicationDtoTypes } from '@/domain/realm/application/application.dto';
import { ApplicationCreate, ApplicationEntity, ApplicationSchema } from '@/domain/realm/application/application.entity';
import { ApplicationRepository, ApplicationRepositorySymbol } from '@/domain/realm/application/application.repository';
import { AppEnv, AppEnvKey, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { inject } from 'inversify';

export const ApplicationServiceSymbol = Symbol.for('ApplicationService');

@Service(ApplicationServiceSymbol, { multiTenant: true })
export class ApplicationService extends AbstractCrudService<ApplicationSchema, ApplicationDtoTypes, ApplicationCreate> {
  @inject(ApplicationRepositorySymbol) protected repository!: ApplicationRepository;
  @inject(AppEnvSymbol) private appEnv!: AppEnv;

  protected buildCreateDataFromDto(dto: ApplicationDtoTypes['CreateRequestDto']): ApplicationCreate {
    return {
      name: dto.name,
      systemId: dto.systemId,
      availableActions: dto.availableActions,
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

  @TraceAsync('application.service.upsertIdmAuthApplication')
  async upsertIdmAuthApplication(): Promise<ApplicationEntity> {
    const systemId = this.appEnv.get(AppEnvKey.IDM_AUTH_SYSTEM_ID);
    
    const data: ApplicationCreate = {
      systemId,
      name: 'IDM Auth',
      description: 'Identity Management Authentication Service',
      availableActions: [],
    };
    
    const application = await this.repository.upsert({ systemId }, data);
    
    this.log.info({ systemId, applicationId: application._id }, 'IDM Auth application upserted');
    return application;
  }
}
