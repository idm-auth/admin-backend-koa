import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'roles';

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String }],
});

schema.add(baseDocumentSchema);

export type RoleSchema = InferSchemaType<typeof schema>;
export type Role = RoleSchema & BaseDocument;
export type RoleDocument = RoleSchema & BaseDocument;
export type RoleDocumentID = RoleSchema & BaseDocumentID;
export type RoleCreate = Omit<RoleSchema, '_id' | 'createdAt' | 'updatedAt'>;

schema.index({ name: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<RoleDocument>(schemaName, schema);
};
