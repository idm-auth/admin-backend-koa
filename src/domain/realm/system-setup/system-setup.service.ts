import {
  ApplicationService,
  ApplicationServiceSymbol,
} from '@/domain/realm/application/application.service';
import { AppEnv, AppEnvSymbol } from '@/infrastructure/env/appEnv.provider';
import { inject } from 'inversify';
import { AbstractService } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';
import {
  SystemSetupRepository,
  SystemSetupRepositorySymbol,
} from './system-setup.repository';

export const SystemSetupServiceSymbol = Symbol.for('SystemSetupService');

@Service(SystemSetupServiceSymbol, { multiTenant: true })
export class SystemSetupService extends AbstractService {
  @inject(SystemSetupRepositorySymbol)
  private repository!: SystemSetupRepository;
  @inject(ApplicationServiceSymbol)
  private applicationService!: ApplicationService;
  @inject(AppEnvSymbol) private appEnv!: AppEnv;

  @TraceAsync('system-setup.service.repairSetup')
  async repairSetup(): Promise<{ status: number }> {
    await this.applicationService.upsertIdmAuthApplication();
    // TODO: Upsert default configurations for applications
    
    this.log.info('Realm setup repair completed');
    return { status: 200 };
  }
}
