import { randomBytes } from 'crypto';
import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type Application = {
  name: string;
  systemId: string;
  description?: string;
  applicationSecret: string;
  isActive: boolean;
};

export const applicationSchema = new mongoose.Schema<Application>(
  {
    name: { type: String, required: true, index: true },
    systemId: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    applicationSecret: {
      type: String,
      required: true,
      default: () => randomBytes(32).toString('base64'),
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
applicationSchema.add(baseEntitySchema);

export type ApplicationSchema = typeof applicationSchema;
export type ApplicationEntity = HydratedDocument<
  InferSchemaType<typeof applicationSchema>
>;

export type ApplicationCreate = Omit<
  InferSchemaType<typeof applicationSchema>,
  'isActive' | 'applicationSecret'
>;
