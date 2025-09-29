import {
  AccountGroupDocument,
  getModel,
} from '@/models/db/realms/accountGroups/accountGroups.v1.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import { AccountGroupCreate, accountGroupCreateSchema } from '@/schemas/v1/accountGroup.schema';
import { getDBName } from '@/services/v1/realm.service';
import { validateZod } from '@/services/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const addAccountToGroup = async (
  tenantId: string,
  args: AccountGroupCreate
): Promise<AccountGroupDocument> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId, groupId: args.groupId });
  await validateZod(args, accountGroupCreateSchema);

  const dbName = await getDBName({ publicUUID: tenantId });
  const accountGroup = await getModel(dbName).create(args);

  return accountGroup;
};

export const removeAccountFromGroup = async (
  tenantId: string,
  args: { accountId: string; groupId: string }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId, groupId: args.groupId });
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findOneAndDelete({
    accountId: args.accountId,
    groupId: args.groupId,
  });
  
  if (!result) {
    throw new NotFoundError('Account-Group relationship not found');
  }
};

export const getAccountGroups = async (
  tenantId: string,
  args: { accountId: DocId }
): Promise<AccountGroupDocument[]> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId });
  await validateZod(args.accountId, DocIdSchema);
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const accountGroups = await getModel(dbName)
    .find({ accountId: args.accountId })
    .populate('groupId');
  
  return accountGroups;
};

export const getGroupAccounts = async (
  tenantId: string,
  args: { groupId: DocId }
): Promise<AccountGroupDocument[]> => {
  const logger = await getLogger();
  logger.debug({ groupId: args.groupId });
  await validateZod(args.groupId, DocIdSchema);
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const groupAccounts = await getModel(dbName)
    .find({ groupId: args.groupId })
    .populate('accountId');
  
  return groupAccounts;
};

export const updateAccountGroupRoles = async (
  tenantId: string,
  args: { accountId: string; groupId: string; roles: string[] }
): Promise<AccountGroupDocument> => {
  const logger = await getLogger();
  logger.debug({ accountId: args.accountId, groupId: args.groupId, roles: args.roles });
  
  const dbName = await getDBName({ publicUUID: tenantId });
  const accountGroup = await getModel(dbName).findOneAndUpdate(
    { accountId: args.accountId, groupId: args.groupId },
    { roles: args.roles },
    { new: true }
  );
  
  if (!accountGroup) {
    throw new NotFoundError('Account-Group relationship not found');
  }
  
  return accountGroup;
};