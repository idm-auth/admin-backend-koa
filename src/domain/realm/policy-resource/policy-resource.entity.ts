import { baseEntitySchema, DocId } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type PolicyResource = {
  policyId: DocId;
  partition: string;
  system: string;
  region: string;
  tenantId: string;
  resourcePath: string;
};

export const policyResourceSchema = new mongoose.Schema<PolicyResource>(
  {
    policyId: { type: String, required: true, index: true },
    partition: { type: String, required: true },
    system: { type: String, required: true, index: true },
    region: { type: String, required: true },
    tenantId: { type: String, required: true },
    resourcePath: { type: String, required: true },
  },
  { timestamps: true }
);
policyResourceSchema.add(baseEntitySchema);
policyResourceSchema.index({ policyId: 1, system: 1, resourcePath: 1 });

export type PolicyResourceSchema = typeof policyResourceSchema;
export type PolicyResourceEntity = HydratedDocument<InferSchemaType<typeof policyResourceSchema>>;
export type PolicyResourceCreate = InferSchemaType<typeof policyResourceSchema>;
