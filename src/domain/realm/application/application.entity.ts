import { randomBytes } from 'crypto';
import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type Application = {
  name: string;
  systemId: string;
  description?: string;
  availableActions?: Array<{
    resourceType: string;
    pathPattern: string;
    operations: string[];
  }>;
  applicationSecret: string;
  isActive: boolean;
};

export const applicationSchema = new mongoose.Schema<Application>(
  {
    name: { type: String, required: true, index: true },
    systemId: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    availableActions: [
      {
        resourceType: { type: String, required: true },
        pathPattern: { type: String, required: true },
        operations: { type: [String], required: true },
      },
    ],
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
applicationSchema.index(
  { 'availableActions.resourceType': 1 },
  { sparse: true }
);
applicationSchema.index(
  { 'availableActions.pathPattern': 1 },
  { sparse: true }
);

export type ApplicationSchema = typeof applicationSchema;
export type ApplicationEntity = HydratedDocument<
  InferSchemaType<typeof applicationSchema>
>;

export type ApplicationCreate = Omit<
  InferSchemaType<typeof applicationSchema>,
  'isActive' | 'applicationSecret'
>;
