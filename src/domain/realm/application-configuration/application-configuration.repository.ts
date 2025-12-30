import { AbstractCrudMongoRepository } from 'koa-inversify-framework/abstract';
import { Repository } from 'koa-inversify-framework/stereotype';
import {
  ApplicationConfigurationEntity,
  ApplicationConfigurationSchema,
  applicationConfigurationSchema,
} from '@/domain/realm/application-configuration/application-configuration.entity';

export const ApplicationConfigurationRepositorySymbol = Symbol.for(
  'ApplicationConfigurationRepository'
);

@Repository(ApplicationConfigurationRepositorySymbol, { multiTenant: true })
export class ApplicationConfigurationRepository extends AbstractCrudMongoRepository<ApplicationConfigurationSchema> {
  constructor() {
    super(applicationConfigurationSchema, 'application-configuration');
  }

  async findByApplicationAndEnvironment(
    applicationName: string,
    environment: string
  ): Promise<ApplicationConfigurationEntity> {
    return this.findOne({ name: applicationName, environment });
  }
}
