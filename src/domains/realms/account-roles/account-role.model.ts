import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'account-roles';

export const schema = new mongoose.Schema({
  accountId: { type: String, required: true },
  roleId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type AccountRoleSchema = InferSchemaType<typeof schema>;
export type AccountRole = AccountRoleSchema & BaseDocument;
export type AccountRoleDocument = AccountRoleSchema & BaseDocument;
export type AccountRoleDocumentID = AccountRoleSchema & BaseDocumentID;
export type AccountRoleCreate = Omit<
  AccountRoleSchema,
  '_id' | 'createdAt' | 'updatedAt'
>;

schema.index({ accountId: 1, roleId: 1 }, { unique: true });
schema.index({ accountId: 1 });
schema.index({ roleId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountRoleDocument>(schemaName, schema);
};
