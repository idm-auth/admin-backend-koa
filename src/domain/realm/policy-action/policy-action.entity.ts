import {
  baseEntitySchema,
  DocId,
} from '@idm-auth/koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type PolicyAction = {
  policyId: DocId;
  system: string;
  resource: string;
  operation: string;
};

export const policyActionSchema = new mongoose.Schema<PolicyAction>(
  {
    policyId: { type: String, required: true, index: true },
    system: { type: String, required: true, index: true },
    resource: { type: String, required: true },
    operation: { type: String, required: true },
  },
  { timestamps: true }
);
policyActionSchema.add(baseEntitySchema);
policyActionSchema.index({ system: 1, resource: 1, operation: 1 });

export type PolicyActionSchema = typeof policyActionSchema;
export type PolicyActionEntity = HydratedDocument<
  InferSchemaType<typeof policyActionSchema>
>;
export type PolicyActionCreate = InferSchemaType<typeof policyActionSchema>;
