// schema do core para realms
import {
  BaseDocumentID,
  baseDocumentSchema,
} from '@/models/base/base.v1.model';
import { getCoreDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schemaName = 'realms';
export const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  publicUUID: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  dbName: { type: String, required: true },
});
schema.add(baseDocumentSchema);

export type Realm = InferSchemaType<typeof schema>;
export type RealmDocumentID = InferSchemaType<typeof schema> & BaseDocumentID;

// model em cima do core DB
export const getModel = () => {
  const conn = getCoreDb();
  return conn.model(schemaName, schema);
};
