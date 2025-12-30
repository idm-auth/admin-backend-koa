import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { CreateInput } from 'koa-inversify-framework/common';
import { ApplicationConfigurationDtoTypes } from '@/domain/realm/application-configuration/application-configuration.dto';
import {
  ApplicationConfigurationEntity,
  ApplicationConfigurationSchema,
} from '@/domain/realm/application-configuration/application-configuration.entity';
import {
  ApplicationConfigurationRepository,
  ApplicationConfigurationRepositorySymbol,
} from '@/domain/realm/application-configuration/application-configuration.repository';
import { inject } from 'inversify';

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

  protected buildCreateData(
    dto: ApplicationConfigurationDtoTypes['CreateRequestDto']
  ): CreateInput<ApplicationConfigurationSchema> {
    return {
      applicationName: dto.applicationName,
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
    applicationName: string,
    environment: string
  ): Promise<ApplicationConfigurationEntity> {
    return this.repository.findByApplicationAndEnvironment(
      applicationName,
      environment
    );
  }
}
