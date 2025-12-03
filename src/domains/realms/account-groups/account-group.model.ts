import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'account-groups';

export const schema = new mongoose.Schema({
  accountId: { type: String, required: true, index: true },
  groupId: { type: String, required: true, index: true },
});

schema.add(baseDocumentSchema);

export type AccountGroupSchema = InferSchemaType<typeof schema>;
export type AccountGroup = AccountGroupSchema & BaseDocument;
export type AccountGroupDocument = AccountGroupSchema & BaseDocument;
export type AccountGroupDocumentID = AccountGroupSchema & BaseDocumentID;
export type AccountGroupCreate = Omit<AccountGroupSchema, never> & {
  // Todos os campos são obrigatórios para AccountGroup
};

schema.index({ accountId: 1, groupId: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountGroupDocument>(schemaName, schema);
};
