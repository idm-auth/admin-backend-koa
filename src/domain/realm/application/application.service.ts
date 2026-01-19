import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { ApplicationDtoTypes } from '@/domain/realm/application/application.dto';
import { ApplicationCreate, ApplicationEntity, ApplicationSchema } from '@/domain/realm/application/application.entity';
import { ApplicationRepository, ApplicationRepositorySymbol } from '@/domain/realm/application/application.repository';
import { AppEnv, AppEnvKey, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { PaginationFilter } from 'koa-inversify-framework/common';
import { inject } from 'inversify';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const ApplicationServiceSymbol = Symbol.for('ApplicationService');

@Service(ApplicationServiceSymbol, { multiTenant: true })
export class ApplicationService extends AbstractCrudService<ApplicationSchema, ApplicationDtoTypes, ApplicationCreate> {
  @inject(ApplicationRepositorySymbol) protected repository!: ApplicationRepository;
  @inject(AppEnvSymbol) private appEnv!: AppEnv;

  protected buildCreateDataFromDto(dto: ApplicationDtoTypes['CreateRequestDto']): ApplicationCreate {
    return {
      name: dto.name,
      systemId: dto.systemId,
    };
  }

  protected buildUpdate(entity: ApplicationEntity, dto: ApplicationDtoTypes['UpdateRequestDto']): ApplicationEntity {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    return entity;
  }

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<ApplicationSchema>> {
    return {};
  }

  @TraceAsync('application.service.findBySystemId')
  async findBySystemId(systemId: string): Promise<ApplicationEntity> {
    return this.repository.findBySystemId(systemId);
  }

  @TraceAsync('application.service.upsertIdmAuthCoreAPIApplication')
  async upsertIdmAuthCoreAPIApplication(): Promise<ApplicationEntity> {
    const systemId = this.appEnv.get(AppEnvKey.IDM_AUTH_CORE_API_SYSTEM_ID);
    
    const data: ApplicationCreate = {
      systemId,
      name: 'IDM Auth Core API',
      description: 'IDM Auth Core API Backend',
    };
    
    const application = await this.repository.upsert({ systemId }, data);
    
    this.log.info({ systemId, applicationId: application._id }, 'IDM Auth Core API application upserted');
    return application;
  }

  @TraceAsync('application.service.upsertIdmAuthCoreWebAdminApplication')
  async upsertIdmAuthCoreWebAdminApplication(): Promise<ApplicationEntity> {
    const systemId = this.appEnv.get(AppEnvKey.IDM_AUTH_CORE_WEB_ADMIN_SYSTEM_ID);
    
    const data: ApplicationCreate = {
      systemId,
      name: 'IDM Auth Core Web Admin',
      description: 'IDM Auth Core Web Admin Frontend',
    };
    
    const application = await this.repository.upsert({ systemId }, data);
    
    this.log.info({ systemId, applicationId: application._id }, 'IDM Auth Core Web Admin application upserted');
    return application;
  }
}
