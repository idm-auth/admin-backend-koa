import { DocId, PublicUUID } from '@/domains/commons/base/base.schema';
import { AccountPolicyDocument, getModel } from './account-policy.model';
import { AccountPolicyCreate } from './account-policy.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';
import { withSpanAsync } from '@/utils/tracing.util';

const SERVICE_NAME = 'account-policy.service';

export const create = async (
  tenantId: PublicUUID,
  data: AccountPolicyCreate
): Promise<AccountPolicyDocument> => {
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
        { tenantId, accountId: data.accountId, policyId: data.policyId },
        'Creating account-policy relationship'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountPolicy = await getModel(dbName).create(data);

      span.setAttributes({ 'entity.id': accountPolicy._id });
      return accountPolicy;
    }
  );
};

export const remove = async (
  tenantId: PublicUUID,
  accountId: DocId,
  policyId: string
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
        { tenantId, accountId, policyId },
        'Removing policy from account'
      );

      const dbName = await getDBName({ publicUUID: tenantId });
      const result = await getModel(dbName).findOneAndDelete({
        accountId,
        policyId,
      });

      if (!result) {
        throw new NotFoundError('Account-Policy relationship not found');
      }
    }
  );
};

export const findByAccountId = async (
  tenantId: PublicUUID,
  accountId: string
): Promise<AccountPolicyDocument[]> => {
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
      logger.info({ tenantId, accountId }, 'Finding policies for account');

      const dbName = await getDBName({ publicUUID: tenantId });
      const accountPolicies = await getModel(dbName).find({ accountId });

      span.setAttributes({ 'result.count': accountPolicies.length });
      return accountPolicies;
    }
  );
};

export const findByPolicyId = async (
  tenantId: PublicUUID,
  policyId: string
): Promise<AccountPolicyDocument[]> => {
  return withSpanAsync(
    {
      name: `${SERVICE_NAME}.findByPolicyId`,
      attributes: {
        'tenant.id': tenantId,
        operation: 'findByPolicyId',
      },
    },
    async (span) => {
      const logger = await getLogger();
      logger.info({ tenantId, policyId }, 'Finding accounts with policy');

      const dbName = await getDBName({ publicUUID: tenantId });
      const policyAccounts = await getModel(dbName).find({ policyId });

      span.setAttributes({ 'result.count': policyAccounts.length });
      return policyAccounts;
    }
  );
};
