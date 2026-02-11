import { baseEntitySchema } from '@idm-auth/koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type ApplicationAction = {
  applicationId: string;
  resourceType: string;
  pathPattern: string;
  operations: string[];
};

export const applicationActionSchema = new mongoose.Schema<ApplicationAction>(
  {
    applicationId: { type: String, required: true, index: true },
    resourceType: { type: String, required: true, index: true },
    pathPattern: { type: String, required: true, index: true },
    operations: { type: [String], required: true },
  },
  { timestamps: true }
);
applicationActionSchema.add(baseEntitySchema);
applicationActionSchema.index(
  { applicationId: 1, resourceType: 1, pathPattern: 1 },
  { unique: true }
);

export type ApplicationActionSchema = typeof applicationActionSchema;
export type ApplicationActionEntity = HydratedDocument<
  InferSchemaType<typeof applicationActionSchema>
>;
export type ApplicationActionCreate = InferSchemaType<ApplicationActionSchema>;
