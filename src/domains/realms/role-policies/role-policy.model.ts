import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'role-policies';

export const schema = new mongoose.Schema({
  roleId: { type: String, required: true },
  policyId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type RolePolicySchema = InferSchemaType<typeof schema>;
export type RolePolicy = RolePolicySchema & BaseDocument;
export type RolePolicyDocument = RolePolicySchema & BaseDocument;
export type RolePolicyDocumentID = RolePolicySchema & BaseDocumentID;
export type RolePolicyCreate = Omit<
  RolePolicySchema,
  '_id' | 'createdAt' | 'updatedAt'
>;

schema.index({ roleId: 1, policyId: 1 }, { unique: true });
schema.index({ roleId: 1 });
schema.index({ policyId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<RolePolicyDocument>(schemaName, schema);
};
