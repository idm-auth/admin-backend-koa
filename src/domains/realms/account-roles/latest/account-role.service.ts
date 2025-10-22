import { AccountRoleDocument, getModel } from './account-role.model';
import { DocId } from '@/domains/commons/base/latest/base.schema';
import {
  AccountRoleCreate,
} from './account-role.schema';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addRoleToAccount = async (
  tenantId: string,
  args: AccountRoleCreate
): Promise<AccountRoleDocument> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId, roleId: args.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const accountRole = await getModel(dbName).create(args);

  return accountRole;
};

export const removeRoleFromAccount = async (
  tenantId: string,
  args: { accountId: DocId; roleId: DocId }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId, roleId: args.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findOneAndDelete({
    accountId: args.accountId,
    roleId: args.roleId,
  });

  if (!result) {
    throw new NotFoundError('Account-Role relationship not found');
  }
};

export const getAccountRoles = async (
  tenantId: string,
  args: { accountId: DocId }
): Promise<AccountRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const accountRoles = await getModel(dbName).find({
    accountId: args.accountId,
  });

  return accountRoles;
};

export const findAll = async (
  tenantId: string
): Promise<AccountRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ tenantId });
  const dbName = await getDBName({ publicUUID: tenantId });
  const accountRoles = await getModel(dbName).find({});
  return accountRoles;
};

export const getRoleAccounts = async (
  tenantId: string,
  args: { roleId: DocId }
): Promise<AccountRoleDocument[]> => {
  const logger = await getLogger();
  logger.debug({ roleId: args.roleId });

  const dbName = await getDBName({ publicUUID: tenantId });
  const roleAccounts = await getModel(dbName).find({ roleId: args.roleId });

  return roleAccounts;
};
