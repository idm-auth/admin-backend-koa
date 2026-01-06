import { ApplicationConfigurationDtoTypes } from '@/domain/realm/application-configuration/application-configuration.dto';
import {
  ApplicationConfigurationCreate,
  ApplicationConfigurationEntity,
  ApplicationConfigurationSchema,
} from '@/domain/realm/application-configuration/application-configuration.entity';
import {
  ApplicationConfigurationRepository,
  ApplicationConfigurationRepositorySymbol,
} from '@/domain/realm/application-configuration/application-configuration.repository';
import {
  ApplicationService,
  ApplicationServiceSymbol,
} from '@/domain/realm/application/application.service';
import { AppEnvKey } from '@/infrastructure/env/appEnv.provider';
import { inject } from 'inversify';
import { AbstractEnv, AbstractTenantResolver, EnvSymbol, TenantResolverSymbol } from 'koa-inversify-framework';
import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { DocId, EnvKey, PublicUUID } from 'koa-inversify-framework/common';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';

export const ApplicationConfigurationServiceSymbol = Symbol.for(
  'ApplicationConfigurationService'
);

export interface IWebAdminConfig {
  api: {
    idm: {
      url: string;
    };
  };
  coreRealm: {
    publicUUID: PublicUUID;
  };
}

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
  @inject(TenantResolverSymbol)
  private tenantResolver!: AbstractTenantResolver;

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
    systemId: string,
    environment: string
  ): Promise<ApplicationConfigurationEntity> {
    const application = await this.applicationService.findBySystemId(systemId);
    return this.repository.findByApplicationAndEnvironment(
      application._id.toString(),
      environment
    );
  }

  @TraceAsync(
    'application-configuration.service.upsertIdmAuthCoreWebAdminConfig'
  )
  async upsertIdmAuthCoreWebAdminConfig(
    applicationId: DocId
  ): Promise<ApplicationConfigurationEntity> {
    const env = this.env.get(EnvKey.NODE_ENV);

    const coreRealmPublicUUID = await this.tenantResolver.getTenantCorePublicUUID();
    const confData: IWebAdminConfig = {
      api: {
        idm: {
          url: this.env.get(AppEnvKey.APPLICATION_WEB_ADMIN_IDM_URL),
        },
      },
      coreRealm: {
        publicUUID: coreRealmPublicUUID,
      },
    };
    const data: ApplicationConfigurationCreate = {
      applicationId,
      environment: env,
      config: confData,
      schema: {},
    };
    const config = await this.repository.upsert(
      { applicationId, environment: env },
      data
    );
    this.log.info(
      { applicationId, env },
      'IDM Auth Core Web Admin config upserted'
    );
    return config;
  }

  @TraceAsync('application-configuration.service.upsertIdmAuthCoreAPIConfig')
  async upsertIdmAuthCoreAPIConfig(
    applicationId: DocId
  ): Promise<ApplicationConfigurationEntity> {
    const env = this.env.get(EnvKey.NODE_ENV);
    const data: ApplicationConfigurationCreate = {
      applicationId,
      environment: env,
      config: {},
      schema: {},
    };
    const config = await this.repository.upsert(
      { applicationId, environment: env },
      data
    );
    this.log.info({ applicationId, env }, 'IDM Auth Core API config upserted');
    return config;
  }
}
