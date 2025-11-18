import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'groups';

export const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

schema.add(baseDocumentSchema);

export type GroupSchema = InferSchemaType<typeof schema>;
export type Group = mongoose.Document & GroupSchema & BaseDocument;
export type GroupDocument = Group;
export type GroupCreate = Omit<GroupSchema, never> & {
  // Todos os campos são obrigatórios para Group
};
export type GroupUpdate = Omit<GroupSchema, never> & {
  // Todos os campos são obrigatórios para Group
};

schema.index({ name: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Group>(schemaName, schema);
};
