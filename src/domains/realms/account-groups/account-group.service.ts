import { AccountGroupDocument, getModel } from './account-group.model';
import { DocId } from '@/domains/commons/base/base.schema';
import { AccountGroupCreate } from './account-group.schema';
import { getDBName } from '@/domains/core/realms/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addAccountToGroup = async (
  tenantId: string,
  data: AccountGroupCreate
): Promise<AccountGroupDocument> => {
  const logger = await getLogger();
  logger.debug({ accountId: data.accountId, groupId: data.groupId });

  const dbName = await getDBName(tenantId);
  const accountGroup = await getModel(dbName).create(data);

  return accountGroup;
};

export const removeAccountFromGroup = async (
  tenantId: string,
  accountId: string,
  groupId: string
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ accountId, groupId });

  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findOneAndDelete({
    accountId,
    groupId,
  });

  if (!result) {
    throw new NotFoundError('Account-Group relationship not found');
  }
};

export const getAccountGroups = async (
  tenantId: string,
  accountId: DocId
): Promise<AccountGroupDocument[]> => {
  const logger = await getLogger();
  logger.debug({ accountId });

  const dbName = await getDBName(tenantId);
  const accountGroups = await getModel(dbName).find({
    accountId,
  });

  return accountGroups;
};

export const getGroupAccounts = async (
  tenantId: string,
  groupId: DocId
): Promise<AccountGroupDocument[]> => {
  const logger = await getLogger();
  logger.debug({ groupId });

  const dbName = await getDBName(tenantId);
  const groupAccounts = await getModel(dbName).find({ groupId });

  return groupAccounts;
};

export const updateAccountGroupRoles = async (
  tenantId: string,
  accountId: string,
  groupId: string,
  roles: string[]
): Promise<AccountGroupDocument> => {
  const logger = await getLogger();
  logger.debug({
    accountId,
    groupId,
    roles,
  });

  const dbName = await getDBName(tenantId);
  const accountGroup = await getModel(dbName).findOneAndUpdate(
    { accountId, groupId },
    { roles },
    { new: true }
  );

  if (!accountGroup) {
    throw new NotFoundError('Account-Group relationship not found');
  }

  return accountGroup;
};
