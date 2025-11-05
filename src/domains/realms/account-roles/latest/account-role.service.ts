import { AccountRoleDocument, getModel } from './account-role.model';
import { DocId } from '@/domains/commons/base/latest/base.schema';
import { AccountRoleCreate } from './account-role.schema';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addRoleToAccount = async (
  tenantId: string,
  data: AccountRoleCreate
): Promise<AccountRoleDocument> => {
  const logger = await getLogger();
  logger.debug({ accountId: data.accountId, roleId: data.roleId });

  const dbName = await getDBName(tenantId);
  const accountRole = await getModel(dbName).create(data);

  return accountRole;
};

export const removeRoleFromAccount = async (
  tenantId: string,
  accountId: DocId,
  roleId: DocId
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ accountId, roleId });

  const dbName = await getDBName(tenantId);
  const result = await getModel(dbName).findOneAndDelete({
    accountId,
    roleId,
  });

  if (!result) {
    throw new NotFoundError('Account-Role relationship not found');
  }
};

export const getAccountRoles = async (
  tenantId: string,
  accountId: DocId
): Promise<AccountRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ accountId });

  const dbName = await getDBName(tenantId);
  const accountRoles = await getModel(dbName).find({
    accountId,
  });

  return accountRoles;
};



export const getRoleAccounts = async (
  tenantId: string,
  roleId: DocId
): Promise<AccountRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ roleId });

  const dbName = await getDBName(tenantId);
  const roleAccounts = await getModel(dbName).find({ roleId });

  return roleAccounts;
};
