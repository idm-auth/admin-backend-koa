import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export const systemSetupSchema = new mongoose.Schema(
  {
    setupKey: { type: String, default: 'singleton', unique: true, index: true },
    initialSetupCompleted: { type: Boolean, default: false },
    initialSetupCompletedAt: { type: Date },
    version: { type: String, default: '1.0.0' },
  },
  { timestamps: true }
);
systemSetupSchema.add(baseEntitySchema);

export type SystemSetupSchema = typeof systemSetupSchema;
export type SystemSetupEntity = HydratedDocument<
  InferSchemaType<typeof systemSetupSchema>
>;
