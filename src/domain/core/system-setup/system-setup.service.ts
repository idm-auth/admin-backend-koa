import { RealmService, RealmServiceSymbol } from '@/domain/core/realm/realm.service';
import { AccountService, AccountServiceSymbol } from '@/domain/realm/account/account.service';
import { SystemSetupService as RealmSystemSetupService, SystemSetupServiceSymbol as RealmSystemSetupServiceSymbol } from '@/domain/realm/system-setup/system-setup.service';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';
import { ApplicationConfigurationService, ApplicationConfigurationServiceSymbol } from '@/domain/realm/application-configuration/application-configuration.service';
import { inject } from 'inversify';
import { AbstractService } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';
import { SystemSetupCoreRepositorySymbol, SystemSetupRepository } from './system-setup.repository';

export const SystemSetupCoreServiceSymbol = Symbol.for(
  'CoreSystemSetupService'
);

@Service(SystemSetupCoreServiceSymbol)
export class SystemSetupService extends AbstractService {
  @inject(SystemSetupCoreRepositorySymbol) private repository!: SystemSetupRepository;
  @inject(RealmServiceSymbol) private realmService!: RealmService;
  @inject(AccountServiceSymbol) private accountService!: AccountService;
  @inject(RealmSystemSetupServiceSymbol) private realmSystemSetupService!: RealmSystemSetupService;
  @inject(ApplicationServiceSymbol) private applicationService!: ApplicationService;
  @inject(ApplicationConfigurationServiceSymbol) private appConfigService!: ApplicationConfigurationService;

  async isInitialSetupCompleted(): Promise<boolean> {
    const setup = await this.repository.findOne(
      { setupKey: 'singleton' },
      { notFoundReturnNull: true }
    );
    if (setup && setup.setupKey) {
      return true;
    }
    return false;
  }

  async repairSetup(): Promise<void> {}

  @TraceAsync('system-setup.service.initSetup')
  async initSetup(data: {
    adminAccount: { email: string; password: string };
  }): Promise<{ status: number }> {
    const isCompleted = await this.isInitialSetupCompleted();
    if (isCompleted) {
      this.log.info('Setup already completed');
      return { status: 200 };
    }

    // Criar aplicação API (backend)
    const apiApplication = await this.applicationService.upsertIdmAuthCoreAPIApplication();
    await this.appConfigService.upsertIdmAuthCoreAPIConfig(apiApplication._id.toString());

    // Criar aplicação Web Admin (frontend)
    const webAdminApplication = await this.applicationService.upsertIdmAuthCoreWebAdminApplication();
    await this.appConfigService.upsertIdmAuthCoreWebAdminConfig(webAdminApplication._id.toString());

    const adminAccount = await this.accountService.createFromDto(
      data.adminAccount
    );
    this.log.info(
      { accountId: adminAccount._id },
      'Initial admin account created'
    );

    await this.realmSystemSetupService.repairSetup();

    await this.repository.upsert(
      { setupKey: 'singleton' },
      { setupKey: 'singleton' }
    );

    return { status: 201 };
  }
}
