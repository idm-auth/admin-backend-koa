import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'applications';

export const schema = new mongoose.Schema({
  applicationSecret: { type: String, required: true },
  name: { type: String, required: true, index: true },
});

schema.add(baseDocumentSchema);

export type ApplicationSchema = InferSchemaType<typeof schema>;
export type Application = mongoose.Document & ApplicationSchema & BaseDocument;
export type ApplicationDocument = Application;
export type ApplicationCreate = Omit<ApplicationSchema, 'applicationSecret'>;
export type ApplicationUpdate = Partial<
  Omit<ApplicationSchema, 'applicationSecret'>
>;

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Application>(schemaName, schema);
};
