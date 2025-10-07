import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'accountRoles';

export const schema = new mongoose.Schema({
  accountId: { type: String, required: true },
  roleId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type AccountRole = InferSchemaType<typeof schema>;
export type AccountRoleDocument = InferSchemaType<typeof schema> & BaseDocument;
export type AccountRoleDocumentID = InferSchemaType<typeof schema> &
  BaseDocumentID;

schema.index({ accountId: 1, roleId: 1 }, { unique: true });
schema.index({ accountId: 1 });
schema.index({ roleId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountRoleDocument>(schemaName, schema);
};
