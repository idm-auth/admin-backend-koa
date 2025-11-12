// Core schema for realms
import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { getCoreDb } from '@/plugins/mongo.plugin';
import { randomBytes } from 'crypto';
import mongoose, { InferSchemaType } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schemaName = 'realms';
export const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  publicUUID: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  dbName: { type: String, required: true },
  jwtConfig: {
    type: {
      secret: {
        type: String,
        required: true,
        immutable: true,
        default: () => randomBytes(32).toString('base64'),
      },
      expiresIn: { type: String, required: true, default: '24h' },
    },
    default: {},
  },
});
schema.add(baseDocumentSchema);

export type RealmSchema = InferSchemaType<typeof schema>;
export type Realm = RealmSchema & BaseDocument;
export type RealmOmitId = Omit<Realm, '_id'>;
export type RealmCreate = Omit<RealmSchema, 'publicUUID' | 'jwtConfig'> & {
  publicUUID?: string;
  jwtConfig?: {
    secret?: string;
    expiresIn?: string;
  };
};
// Model on top of core DB
export const getModel = () => {
  const conn = getCoreDb();
  return conn.model<Realm>(schemaName, schema);
};