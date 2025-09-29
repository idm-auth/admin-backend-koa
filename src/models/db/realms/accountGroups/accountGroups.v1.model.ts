import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/models/base/base.v1.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'accountGroups';

export const schema = new mongoose.Schema({
  accountId: { type: String, required: true },
  groupId: { type: String, required: true },
  roles: [{ type: String }],
});

schema.add(baseDocumentSchema);

export type AccountGroup = InferSchemaType<typeof schema>;
export type AccountGroupDocument = InferSchemaType<typeof schema> &
  BaseDocument;
export type AccountGroupDocumentID = InferSchemaType<typeof schema> &
  BaseDocumentID;

schema.index({ accountId: 1, groupId: 1 }, { unique: true });
schema.index({ accountId: 1 });
schema.index({ groupId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountGroupDocument>(schemaName, schema);
};
