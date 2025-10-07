import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'policies';

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  effect: { type: String, enum: ['Allow', 'Deny'], required: true },
  actions: [{ type: String, required: true }],
  resources: [{ type: String, required: true }],
  conditions: { type: mongoose.Schema.Types.Mixed },
});

schema.add(baseDocumentSchema);

export type Policy = InferSchemaType<typeof schema>;
export type PolicyDocument = InferSchemaType<typeof schema> & BaseDocument;
export type PolicyDocumentID = InferSchemaType<typeof schema> & BaseDocumentID;

schema.index({ name: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<PolicyDocument>(schemaName, schema);
};
