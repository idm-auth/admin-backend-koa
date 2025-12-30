import { ApplicationConfigurationDtoTypes } from '@/domain/realm/application-configuration/application-configuration.dto';
import {
  ApplicationConfigurationEntity,
  ApplicationConfigurationSchema,
} from '@/domain/realm/application-configuration/application-configuration.entity';
import {
  ApplicationConfigurationRepository,
  ApplicationConfigurationRepositorySymbol,
} from '@/domain/realm/application-configuration/application-configuration.repository';
import {
  BACKEND_API_APPLICATION_NAME,
  BackendApiConfigEntity,
  isBackendApiConfig,
} from '@/domain/realm/application-configuration/config/backend-api.config';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';
import { inject } from 'inversify';
import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { CreateInput } from 'koa-inversify-framework/common';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { ValidationError } from 'koa-inversify-framework/error';
import { Env, EnvKey, EnvSymbol } from 'koa-inversify-framework/infrastructure';
import { Service } from 'koa-inversify-framework/stereotype';

export const ApplicationConfigurationServiceSymbol = Symbol.for(
  'ApplicationConfigurationService'
);

@Service(ApplicationConfigurationServiceSymbol, { multiTenant: true })
export class ApplicationConfigurationService extends AbstractCrudService<
  ApplicationConfigurationSchema,
  ApplicationConfigurationDtoTypes
> {
  @inject(ApplicationConfigurationRepositorySymbol)
  protected repository!: ApplicationConfigurationRepository;
  @inject(EnvSymbol) private env!: Env;
  @inject(ApplicationServiceSymbol) private applicationService!: ApplicationService;

  protected buildCreateData(
    dto: ApplicationConfigurationDtoTypes['CreateRequestDto']
  ): CreateInput<ApplicationConfigurationSchema> {
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

  @TraceAsync('application-configuration.service.getBackendApiConfig')
  async getBackendApiConfig(): Promise<BackendApiConfigEntity> {
    const env = this.env.get(EnvKey.NODE_ENV);
    
    this.log.debug({ systemId: BACKEND_API_APPLICATION_NAME, env }, 'Getting backend API config');
    
    const application = await this.applicationService.findBySystemId(BACKEND_API_APPLICATION_NAME);
    const appConfig = await this.getByApplicationAndEnvironment(application._id.toString(), env);

    if (!isBackendApiConfig(appConfig.config)) {
      throw new ValidationError('Invalid backend-api configuration');
    }

    return appConfig as BackendApiConfigEntity;
  }
}
