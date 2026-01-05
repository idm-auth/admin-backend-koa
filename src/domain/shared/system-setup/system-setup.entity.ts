import crypto from 'crypto';
import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const SYSTEM_SETUP_KEY = 'singleton';
const SYSTEM_SETUP_VERSION = '1.0.0';
const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '15m';
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = '7d';

export const systemSetupSchema = new mongoose.Schema(
  {
    setupKey: {
      type: String,
      default: SYSTEM_SETUP_KEY,
      unique: true,
      index: true,
    },
    lastRepairAt: { type: Date },
    version: { type: String, default: SYSTEM_SETUP_VERSION },
    jwtSecret: {
      type: String,
      default: () => crypto.randomBytes(64).toString('hex'),
    },
    accessTokenExpiresIn: {
      type: String,
      default: DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
    },
    refreshTokenExpiresIn: {
      type: String,
      default: DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
  { timestamps: true }
);
systemSetupSchema.add(baseEntitySchema);

export type SystemSetupSchema = typeof systemSetupSchema;
export type SystemSetupEntity = HydratedDocument<
  InferSchemaType<typeof systemSetupSchema>
>;
