import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type GroupPolicy = {
  groupId: string;
  policyId: string;
};

export const groupPolicySchema = new mongoose.Schema<GroupPolicy>(
  {
    groupId: { type: String, required: true, index: true },
    policyId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
groupPolicySchema.add(baseEntitySchema);
groupPolicySchema.index({ groupId: 1, policyId: 1 }, { unique: true });

export type GroupPolicySchema = typeof groupPolicySchema;
export type GroupPolicyEntity = HydratedDocument<InferSchemaType<typeof groupPolicySchema>>;

export type GroupPolicyCreate = InferSchemaType<typeof groupPolicySchema>;
