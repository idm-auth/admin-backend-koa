/**
 * System-wide constants
 */

export const IAM_SYSTEM_ID = 'iam-system';

export enum CrudOperation {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

export const CRUD_OPERATIONS = Object.values(CrudOperation);
