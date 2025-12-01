import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'group-policies';

export const schema = new mongoose.Schema({
  groupId: { type: String, required: true },
  policyId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type GroupPolicySchema = InferSchemaType<typeof schema>;
export type GroupPolicy = GroupPolicySchema & BaseDocument;
export type GroupPolicyDocument = GroupPolicySchema & BaseDocument;
export type GroupPolicyDocumentID = GroupPolicySchema & BaseDocumentID;
export type GroupPolicyCreate = Omit<
  GroupPolicySchema,
  '_id' | 'createdAt' | 'updatedAt'
>;

schema.index({ groupId: 1, policyId: 1 }, { unique: true });
schema.index({ groupId: 1 });
schema.index({ policyId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<GroupPolicyDocument>(schemaName, schema);
};
