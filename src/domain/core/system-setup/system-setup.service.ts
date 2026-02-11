import {
  RealmService,
  RealmServiceSymbol,
} from '@/domain/core/realm/realm.service';
import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import {
  SystemSetupService as RealmSystemSetupService,
  SystemSetupServiceSymbol as RealmSystemSetupServiceSymbol,
} from '@/domain/realm/system-setup/system-setup.service';
import {
  ApplicationService,
  ApplicationServiceSymbol,
} from '@/domain/realm/application/application.service';
import {
  ApplicationConfigurationService,
  ApplicationConfigurationServiceSymbol,
} from '@/domain/realm/application-configuration/application-configuration.service';
import { inject } from 'inversify';
import { AbstractService } from '@idm-auth/koa-inversify-framework/abstract';
import { TraceAsync } from '@idm-auth/koa-inversify-framework/decorator';
import { Service } from '@idm-auth/koa-inversify-framework/stereotype';
import {
  SystemSetupCoreRepositorySymbol,
  SystemSetupRepository,
} from './system-setup.repository';
import {
  ExecutionContextProvider,
  ExecutionContextSymbol,
} from '@idm-auth/koa-inversify-framework/infrastructure';

export const SystemSetupCoreServiceSymbol = Symbol.for(
  'CoreSystemSetupService'
);

@Service(SystemSetupCoreServiceSymbol)
export class SystemSetupService extends AbstractService {
  @inject(SystemSetupCoreRepositorySymbol)
  private repository!: SystemSetupRepository;
  @inject(RealmServiceSymbol) private realmService!: RealmService;
  @inject(AccountServiceSymbol) private accountService!: AccountService;
  @inject(RealmSystemSetupServiceSymbol)
  private realmSystemSetupService!: RealmSystemSetupService;
  @inject(ApplicationServiceSymbol)
  private applicationService!: ApplicationService;
  @inject(ApplicationConfigurationServiceSymbol)
  private appConfigService!: ApplicationConfigurationService;
  @inject(ExecutionContextSymbol)
  private executionContext!: ExecutionContextProvider;

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
    // Garante que o realm core existe e obtém seu publicUUID
    // RealmService encapsula a lógica de criar se não existir
    const coreRealmPublicUUID = await this.realmService.ensureCoreRealmExists();

    // Seta o tenantId com o publicUUID do realm core
    // Serviços multi-tenant vão conseguir resolver o realm
    this.executionContext.setTenantId(coreRealmPublicUUID);

    const isCompleted = await this.isInitialSetupCompleted();
    if (isCompleted) {
      this.log.info('Setup already completed');
      return { status: 200 };
    }

    // Criar aplicação API (backend)
    const apiApplication =
      await this.applicationService.upsertIdmAuthCoreAPIApplication();
    await this.appConfigService.upsertIdmAuthCoreAPIConfig(
      apiApplication._id.toString()
    );

    // Criar aplicação Web Admin (frontend)
    const webAdminApplication =
      await this.applicationService.upsertIdmAuthCoreWebAdminApplication();
    await this.appConfigService.upsertIdmAuthCoreWebAdminConfig(
      webAdminApplication._id.toString()
    );

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
