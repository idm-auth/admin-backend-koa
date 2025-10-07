import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'roles';

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  permissions: [{ type: String }],
});

schema.add(baseDocumentSchema);

export type Role = InferSchemaType<typeof schema>;
export type RoleDocument = InferSchemaType<typeof schema> & BaseDocument;
export type RoleDocumentID = InferSchemaType<typeof schema> & BaseDocumentID;

schema.index({ name: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<RoleDocument>(schemaName, schema);
};
