import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'account-policies';

export const schema = new mongoose.Schema({
  accountId: { type: String, required: true },
  policyId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type AccountPolicySchema = InferSchemaType<typeof schema>;
export type AccountPolicy = AccountPolicySchema & BaseDocument;
export type AccountPolicyDocument = AccountPolicySchema & BaseDocument;
export type AccountPolicyDocumentID = AccountPolicySchema & BaseDocumentID;
export type AccountPolicyCreate = Omit<
  AccountPolicySchema,
  '_id' | 'createdAt' | 'updatedAt'
>;

schema.index({ accountId: 1, policyId: 1 }, { unique: true });
schema.index({ accountId: 1 });
schema.index({ policyId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountPolicyDocument>(schemaName, schema);
};
