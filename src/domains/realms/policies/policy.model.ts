import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'policies';

export const POLICY_EFFECTS = ['Allow', 'Deny'] as const;
export type PolicyEffect = (typeof POLICY_EFFECTS)[number];

export const schema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    default: '2025-12-24',
    validate: {
      validator: (v: string) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
        const date = new Date(v);
        return (
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          v === date.toISOString().split('T')[0]
        );
      },
      message: 'Version must be valid ISO date format (YYYY-MM-DD)',
    },
  },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  effect: { type: String, required: true, enum: POLICY_EFFECTS },
  actions: [{ type: String, required: true }],
  resources: [{ type: String, required: true }],
});

schema.add(baseDocumentSchema);

export type PolicySchema = InferSchemaType<typeof schema>;
export type Policy = PolicySchema & BaseDocument;
export type PolicyDocument = PolicySchema & BaseDocument;
export type PolicyDocumentID = PolicySchema & BaseDocumentID;
export type PolicyCreate = PolicySchema;

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<PolicyDocument>(schemaName, schema);
};
