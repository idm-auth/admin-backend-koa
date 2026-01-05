import { ApplicationConfigurationDtoTypes } from '@/domain/realm/application-configuration/application-configuration.dto';
import { ApplicationConfigurationCreate, ApplicationConfigurationEntity, ApplicationConfigurationSchema } from '@/domain/realm/application-configuration/application-configuration.entity';
import { ApplicationConfigurationRepository, ApplicationConfigurationRepositorySymbol } from '@/domain/realm/application-configuration/application-configuration.repository';
import { BACKEND_API_APPLICATION_NAME, BackendApiConfigEntity, isBackendApiConfig } from '@/domain/realm/application-configuration/config/backend-api.config';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';
import { inject } from 'inversify';
import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { AbstractEnv } from 'koa-inversify-framework';
import { DocId, EnvKey } from 'koa-inversify-framework/common';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { ValidationError } from 'koa-inversify-framework/error';
import { EnvSymbol } from 'koa-inversify-framework';
import { Service } from 'koa-inversify-framework/stereotype';

export const ApplicationConfigurationServiceSymbol = Symbol.for(
  'ApplicationConfigurationService'
);

@Service(ApplicationConfigurationServiceSymbol, { multiTenant: true })
export class ApplicationConfigurationService extends AbstractCrudService<
  ApplicationConfigurationSchema,
  ApplicationConfigurationDtoTypes,
  ApplicationConfigurationCreate
> {
  @inject(ApplicationConfigurationRepositorySymbol)
  protected repository!: ApplicationConfigurationRepository;
  @inject(EnvSymbol) private env!: AbstractEnv;
  @inject(ApplicationServiceSymbol)
  private applicationService!: ApplicationService;

  protected buildCreateDataFromDto(
    dto: ApplicationConfigurationDtoTypes['CreateRequestDto']
  ): ApplicationConfigurationCreate {
    return {
      applicationId: dto.applicationId,
      environment: dto.environment,
      config: dto.config,
      schema: dto.schema,
    };
  }

  protected buildUpdate(
    entity: ApplicationConfigurationEntity,
    dto: ApplicationConfigurationDtoTypes['UpdateRequestDto']
  ): ApplicationConfigurationEntity {
    if (dto.config !== undefined) entity.config = dto.config;
    if (dto.schema !== undefined) entity.schema = dto.schema;
    return entity;
  }

  @TraceAsync(
    'application-configuration.service.getByApplicationAndEnvironment'
  )
  async getByApplicationAndEnvironment(
    applicationId: string,
    environment: string
  ): Promise<ApplicationConfigurationEntity> {
    return this.repository.findByApplicationAndEnvironment(
      applicationId,
      environment
    );
  }

  @TraceAsync('application-configuration.service.upsertIdmAuthCoreFrontendConfig')
  async upsertIdmAuthCoreFrontendConfig(applicationId: DocId): Promise<ApplicationConfigurationEntity> {
    const env = this.env.get(EnvKey.NODE_ENV);
    const data: ApplicationConfigurationCreate = {
      applicationId,
      environment: env,
      config: {},
      schema: {},
    };
    const config = await this.repository.upsert({ applicationId, environment: env }, data);
    this.log.info({ applicationId, env }, 'IDM Auth Core Frontend config upserted');
    return config;
  }

  @TraceAsync('application-configuration.service.upsertIdmAuthCoreBackendConfig')
  async upsertIdmAuthCoreBackendConfig(applicationId: DocId): Promise<ApplicationConfigurationEntity> {
    const env = this.env.get(EnvKey.NODE_ENV);
    const data: ApplicationConfigurationCreate = {
      applicationId,
      environment: env,
      config: {},
      schema: {},
    };
    const config = await this.repository.upsert({ applicationId, environment: env }, data);
    this.log.info({ applicationId, env }, 'IDM Auth Core Backend config upserted');
    return config;
  }
}
