import { DocId, PublicUUID } from '@/domains/commons/base/base.schema';
import { AccountRoleDocument, getModel } from './account-role.model';
import { AccountRoleCreate } from './account-role.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'account-role.service';

export const create = async (
  tenantId: PublicUUID,
  data: AccountRoleCreate
): Promise<AccountRoleDocument> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.create`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'create',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info(
        { tenantId, accountId: data.accountId, roleId: data.roleId },
        'Creating account-role relationship'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountRole = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': accountRole._id });
      return accountRole;
    }
  );
};

export const remove = async (
  tenantId: PublicUUID,
  accountId: DocId,
  roleId: DocId
): Promise<void> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.remove`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'remove',
      },
    },
    async () => {
      const logger = await getLogger();
      logger.info(
        { tenantId, accountId, roleId },
        'Removing account from role'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findOneAndDelete({
        accountId,
        roleId,
      });

      if (!result) {
        throw new NotFoundError('Account-Role relationship not found');
      }
    }
  );
};

export const findByAccountId = async (
  tenantId: PublicUUID,
  accountId: DocId
): Promise<AccountRoleDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByAccountId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByAccountId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, accountId }, 'Finding roles for account');

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountRoles = await getModel(dbName).find({ accountId });

      span.setAttributes({ 'result.count': accountRoles.length });
      return accountRoles;
    }
  );
};

export const findByRoleId = async (
  tenantId: PublicUUID,
  roleId: DocId
): Promise<AccountRoleDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByRoleId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByRoleId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, roleId }, 'Finding accounts with role');

      const dbName = await getDBName({ publicUUID: tenantId });
      const roleAccounts = await getModel(dbName).find({ roleId });

      span.setAttributes({ 'result.count': roleAccounts.length });
      return roleAccounts;
    }
  );
};
