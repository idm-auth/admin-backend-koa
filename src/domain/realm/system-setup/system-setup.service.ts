import { AbstractCrudService } from 'koa-inversify-framework/abstract';
import { Service } from 'koa-inversify-framework/stereotype';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { inject } from 'inversify';
import { SystemSetupDtoTypes } from '@/domain/realm/system-setup/system-setup.dto';
import {
  SystemSetupSchema,
  SystemSetupEntity,
} from '@/domain/shared/system-setup/system-setup.entity';
import {
  SystemSetupRepository,
  SystemSetupRepositorySymbol,
} from './system-setup.repository';
import {
  ApplicationService,
  ApplicationServiceSymbol,
} from '@/domain/realm/application/application.service';
import { PaginationFilter } from 'koa-inversify-framework/common';
import type { QueryFilter, InferSchemaType } from 'mongoose';

export const SystemSetupServiceSymbol = Symbol.for('SystemSetupService');

@Service(SystemSetupServiceSymbol, { multiTenant: true })
export class SystemSetupService extends AbstractCrudService<
  SystemSetupSchema,
  SystemSetupDtoTypes,
  never
> {
  @inject(SystemSetupRepositorySymbol)
  protected repository!: SystemSetupRepository;
  @inject(ApplicationServiceSymbol)
  private applicationService!: ApplicationService;

  protected buildPaginationFilter(
    filter: PaginationFilter
  ): QueryFilter<InferSchemaType<SystemSetupSchema>> {
    return {};
  }

  protected buildCreateDataFromDto(): never {
    throw new Error('Create not supported');
  }

  protected buildUpdate(
    entity: SystemSetupEntity,
    dto: SystemSetupDtoTypes['UpdateRequestDto']
  ): SystemSetupEntity {
    this.log.debug({ id: entity._id, dto }, 'Building update');
    if (dto.jwtSecret !== undefined) entity.jwtSecret = dto.jwtSecret;
    if (dto.accessTokenExpiresIn !== undefined)
      entity.accessTokenExpiresIn = dto.accessTokenExpiresIn;
    if (dto.refreshTokenExpiresIn !== undefined)
      entity.refreshTokenExpiresIn = dto.refreshTokenExpiresIn;
    return entity;
  }

  @TraceAsync('system-setup.service.repairSetup')
  async repairSetup(): Promise<{ status: number }> {
    await this.repository.upsert(
      { setupKey: 'singleton' },
      { setupKey: 'singleton', lastRepairAt: new Date() }
    );
    this.log.info('Realm setup repair completed');
    return { status: 200 };
  }

  @TraceAsync('system-setup.service.getJwtConfig')
  async getJwtConfig(): Promise<{
    secret: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  }> {
    const setup = await this.repository.findOne({ setupKey: 'singleton' });
    return {
      secret: setup.jwtSecret,
      accessTokenExpiresIn: setup.accessTokenExpiresIn,
      refreshTokenExpiresIn: setup.refreshTokenExpiresIn,
    };
  }
}
