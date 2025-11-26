import { AccountGroupDocument, getModel } from './account-group.model';
import { AccountGroupCreate } from './account-group.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'account-group.service';

export const create = async (
  tenantId: string,
  data: AccountGroupCreate
): Promise<AccountGroupDocument> => {
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
        { tenantId, accountId: data.accountId, groupId: data.groupId },
        'Creating account-group relationship'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountGroup = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': accountGroup._id });
      return accountGroup;
    }
  );
};

export const remove = async (
  tenantId: string,
  accountId: string,
  groupId: string
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
        { tenantId, accountId, groupId },
        'Removing account from group'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findOneAndDelete({
        accountId,
        groupId,
      });

      if (!result) {
        throw new NotFoundError('Account-Group relationship not found');
      }
    }
  );
};

export const findByAccountId = async (
  tenantId: string,
  accountId: string
): Promise<AccountGroupDocument[]> => {
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
      logger.info({ tenantId, accountId }, 'Finding groups for account');

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountGroups = await getModel(dbName).find({ accountId });

      span.setAttributes({ 'result.count': accountGroups.length });
      return accountGroups;
    }
  );
};

export const findByGroupId = async (
  tenantId: string,
  groupId: string
): Promise<AccountGroupDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByGroupId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByGroupId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, groupId }, 'Finding accounts in group');

      const dbName = await getDBName({ publicUUID: tenantId });
      const groupAccounts = await getModel(dbName).find({ groupId });

      span.setAttributes({ 'result.count': groupAccounts.length });
      return groupAccounts;
    }
  );
};


