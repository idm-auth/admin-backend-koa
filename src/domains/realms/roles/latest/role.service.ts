import {
  RoleDocument,
  getModel,
} from '@/domains/realms/roles/latest/role.model';
import { DocId, DocIdSchema } from '@/schemas/latest/base.schema';
import {
  RoleCreate,
  roleCreateSchema,
} from '@/domains/realms/roles/latest/role.schema';
import { getDBName } from '@/domains/core/realms/latest/realm.service';
import { validateZod } from '@/domains/commons/validations/v1/validation.service';
import { getLogger } from '@/utils/localStorage.util';
import { NotFoundError } from '@/errors/not-found';

export const create = async (
  tenantId: string,
  args: RoleCreate
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });
  await validateZod(args, roleCreateSchema);

  const dbName = await getDBName({ publicUUID: tenantId });
  const role = await getModel(dbName).create(args);

  return role;
};

export const findById = async (
  tenantId: string,
  args: { id: DocId }
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ tenantId: tenantId, id: args.id });
  await validateZod(args.id, DocIdSchema);
  const dbName = await getDBName({ publicUUID: tenantId });
  const role = await getModel(dbName).findById(args.id);
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
};

export const findByName = async (
  tenantId: string,
  args: { name: string }
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ name: args.name });
  const dbName = await getDBName({ publicUUID: tenantId });
  const role = await getModel(dbName).findOne({ name: args.name });
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
};

export const update = async (
  tenantId: string,
  args: {
    id: string;
    name?: string;
    description?: string;
    permissions?: string[];
  }
): Promise<RoleDocument> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const role = await getModel(dbName).findByIdAndUpdate(
    args.id,
    {
      name: args.name,
      description: args.description,
      permissions: args.permissions,
    },
    { new: true, runValidators: true }
  );
  if (!role) {
    throw new NotFoundError('Role not found');
  }
  return role;
};

export const remove = async (
  tenantId: string,
  args: { id: string }
): Promise<void> => {
  const logger = await getLogger();
  logger.debug({ id: args.id });
  const dbName = await getDBName({ publicUUID: tenantId });
  const result = await getModel(dbName).findByIdAndDelete(args.id);
  if (!result) {
    throw new NotFoundError('Role not found');
  }
};
