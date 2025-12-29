import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export type Realm = {
  name: string;
  description?: string;
  publicUUID: string;
  dbName: string;
  jwtConfig: {
    secret: string;
    expiresIn: string;
  };
};

export const realmSchema = new mongoose.Schema<Realm>(
  {
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
  },
  { timestamps: true }
);
realmSchema.add(baseEntitySchema);

export type RealmSchema = typeof realmSchema;
export type RealmEntity = HydratedDocument<InferSchemaType<typeof realmSchema>>;
