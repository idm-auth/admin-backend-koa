import { AbstractService, AbstractEnv } from 'koa-inversify-framework/abstract';
import { TraceAsync } from 'koa-inversify-framework/decorator';
import { Service } from 'koa-inversify-framework/stereotype';
import { inject } from 'inversify';
import { RealmService, RealmServiceSymbol } from '@/domain/core/realm/realm.service';
import { AccountService, AccountServiceSymbol } from '@/domain/realm/account/account.service';
import { ApplicationService, ApplicationServiceSymbol } from '@/domain/realm/application/application.service';
import { ApplicationConfigurationService, ApplicationConfigurationServiceSymbol } from '@/domain/realm/application-configuration/application-configuration.service';
import { EnvSymbol } from 'koa-inversify-framework/abstract';
import { EnvKey } from 'koa-inversify-framework/common';
import { NotFoundError } from 'koa-inversify-framework/error';
import { BACKEND_API_APPLICATION_NAME } from '@/domain/realm/application-configuration/config/backend-api.config';

const IAM_SYSTEM_ID = 'iam-system';
const FRONTEND_APPLICATION_NAME = 'idm-core-web-admin';

export const CoreApplicationConfigurationServiceSymbol = Symbol.for(
  'CoreApplicationConfigurationService'
);

@Service(CoreApplicationConfigurationServiceSymbol)
export class CoreApplicationConfigurationService extends AbstractService {
  @inject(RealmServiceSymbol) private realmService!: RealmService;
  @inject(AccountServiceSymbol) private accountService!: AccountService;
  @inject(ApplicationServiceSymbol) private applicationService!: ApplicationService;
  @inject(ApplicationConfigurationServiceSymbol) private appConfigService!: ApplicationConfigurationService;
  @inject(EnvSymbol) private env!: AbstractEnv;

  /**
   * Repair Default Setup
   *
   * Checks and recreates default data if missing:
   * - IAM System application
   * - iam-admin role
   * - iam-admin group
   * - Default policies (iam-admin-full-access)
   * - role-policy associations
   * - group-role association
   *
   * Does NOT touch admin accounts - only system resources.
   */
  @TraceAsync('core-application-configuration.service.repairDefaultSetup')
  async repairDefaultSetup(
    tenantId: string
  ): Promise<{ status: number; tenantId: string }> {
    try {
      const iamSystemApp = await this.applicationService.findBySystemId(IAM_SYSTEM_ID);
      this.log.info({ applicationId: iamSystemApp._id }, 'IAM System application already exists');
    } catch (error) {
      if (error instanceof NotFoundError) {
        const iamSystemApp = await this.applicationService.create({
          name: 'IAM System',
          systemId: IAM_SYSTEM_ID,
          availableActions: [],
        });
        this.log.info({ applicationId: iamSystemApp._id }, 'IAM System application created');
      } else {
        throw error;
      }
    }

    this.log.info({ tenantId }, 'Default setup repair completed');
    return { status: 200, tenantId };
  }

  /**
   * Initial Setup - Database Seeding
   *
   * Called by frontend via /config/init-setup endpoint on first startup.
   *
   * Creates:
   * - Core realm
   * - Initial admin account (from request)
   * - Default system resources (via repairDefaultSetup)
   * - Admin account associated with iam-admin group
   * - Web admin configuration
   *
   * Idempotent - returns 200 if already exists.
   */
  @TraceAsync('core-application-configuration.service.initSetup')
  async initSetup(data: {
    adminAccount: { email: string; password: string };
  }): Promise<{ status: number }> {
    const coreRealm = await this.realmService.getRealmCore();
    const tenantId = coreRealm.publicUUID;
    const env = this.env.get(EnvKey.NODE_ENV);

    let backendApp;
    try {
      backendApp = await this.applicationService.findBySystemId(BACKEND_API_APPLICATION_NAME);
    } catch (error) {
      if (error instanceof NotFoundError) {
        backendApp = await this.applicationService.create({
          name: 'Backend API',
          systemId: BACKEND_API_APPLICATION_NAME,
          availableActions: [],
        });
        this.log.info({ applicationId: backendApp._id }, 'Backend API application created');
      } else {
        throw error;
      }
    }

    let frontendApp;
    try {
      frontendApp = await this.applicationService.findBySystemId(FRONTEND_APPLICATION_NAME);
    } catch (error) {
      if (error instanceof NotFoundError) {
        frontendApp = await this.applicationService.create({
          name: 'Web Admin',
          systemId: FRONTEND_APPLICATION_NAME,
          availableActions: [],
        });
        this.log.info({ applicationId: frontendApp._id }, 'Web Admin application created');
      } else {
        throw error;
      }
    }

    try {
      await this.appConfigService.getByApplicationAndEnvironment(
        backendApp._id.toString(),
        env
      );
      await this.appConfigService.getByApplicationAndEnvironment(
        frontendApp._id.toString(),
        env
      );
      this.log.info('Setup already exists');
      return { status: 200 };
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }

    const adminAccount = await this.accountService.create(data.adminAccount);
    this.log.info({ accountId: adminAccount._id }, 'Initial admin account created');

    await this.repairDefaultSetup(tenantId);

    await this.appConfigService.create({
      applicationId: backendApp._id.toString(),
      environment: env,
      config: {
        jwt: {
          secret: 'default-jwt-secret-change-in-production',
          accessTokenExpiresIn: '24h',
          refreshTokenExpiresIn: '7d',
        },
      },
    });
    this.log.info('Backend API configuration created');

    await this.appConfigService.create({
      applicationId: frontendApp._id.toString(),
      environment: env,
      config: {
        api: {
          main: {
            url: this.env.get(EnvKey.IDM_URL),
          },
        },
        coreRealm: {
          publicUUID: tenantId,
        },
      },
    });
    this.log.info('Web Admin configuration created');

    return { status: 201 };
  }
}
