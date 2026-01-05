import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const SYSTEM_SETUP_KEY = 'singleton';
const SYSTEM_SETUP_VERSION = '1.0.0';

export const systemSetupSchema = new mongoose.Schema(
  {
    setupKey: { type: String, default: SYSTEM_SETUP_KEY, unique: true, index: true },
    lastRepairAt: { type: Date },
    version: { type: String, default: SYSTEM_SETUP_VERSION },
  },
  { timestamps: true }
);
systemSetupSchema.add(baseEntitySchema);

export type SystemSetupSchema = typeof systemSetupSchema;
export type SystemSetupEntity = HydratedDocument<
  InferSchemaType<typeof systemSetupSchema>
>;
