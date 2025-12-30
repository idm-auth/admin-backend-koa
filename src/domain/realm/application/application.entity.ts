import { baseEntitySchema } from 'koa-inversify-framework/common';
import { randomBytes } from 'crypto';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type Application = {
  _id: string;
  name: string;
  systemId: string;
  availableActions: Array<{
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
applicationSchema.index({ 'availableActions.resourceType': 1 });
applicationSchema.index({ 'availableActions.pathPattern': 1 });

export type ApplicationSchema = typeof applicationSchema;
export type ApplicationEntity = HydratedDocument<
  InferSchemaType<typeof applicationSchema>
>;
