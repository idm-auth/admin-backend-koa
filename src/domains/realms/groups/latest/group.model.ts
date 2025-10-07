import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'groups';

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

schema.add(baseDocumentSchema);

export type Group = InferSchemaType<typeof schema>;
export type GroupDocument = InferSchemaType<typeof schema> & BaseDocument;
export type GroupDocumentID = InferSchemaType<typeof schema> & BaseDocumentID;

schema.index({ name: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<GroupDocument>(schemaName, schema);
};
