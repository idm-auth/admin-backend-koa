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
import { inject } from 'inversify';
import { AbstractService } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';
import {
  SystemSetupRepository,
  SystemSetupRepositorySymbol,
} from './system-setup.repository';

export const SystemSetupServiceSymbol = Symbol.for('CoreSystemSetupService');

@Service(SystemSetupServiceSymbol)
export class SystemSetupService extends AbstractService {
  @inject(SystemSetupRepositorySymbol)
  private repository!: SystemSetupRepository;
  @inject(RealmServiceSymbol) private realmService!: RealmService;
  @inject(AccountServiceSymbol) private accountService!: AccountService;
  @inject(RealmSystemSetupServiceSymbol)
  private realmSystemSetupService!: RealmSystemSetupService;

  async isInitialSetupCompleted(): Promise<boolean> {
    const setup = await this.repository.findOne(
      { setupKey: 'singleton' },
      { notFoundReturnNull: true }
    );
    if (setup && setup.initialSetupCompleted) {
      return true;
    }
    return false;
  }

  async markInitialSetupCompleted(): Promise<void> {
    await this.repository.upsert(
      { setupKey: 'singleton' },
      {
        setupKey: 'singleton',
        initialSetupCompleted: true,
        initialSetupCompletedAt: new Date(),
      }
    );
    this.log.info('Initial setup marked as completed');
  }

  @TraceAsync('system-setup.service.initSetup')
  async initSetup(data: {
    adminAccount: { email: string; password: string };
  }): Promise<{ status: number }> {
    const isCompleted = await this.isInitialSetupCompleted();
    if (isCompleted) {
      this.log.info('Setup already completed');
      return { status: 200 };
    }

    await this.realmSystemSetupService.repairSetup();

    const adminAccount = await this.accountService.createFromDto(
      data.adminAccount
    );
    this.log.info(
      { accountId: adminAccount._id },
      'Initial admin account created'
    );

    await this.markInitialSetupCompleted();

    return { status: 201 };
  }
}
