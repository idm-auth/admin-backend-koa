import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type AccountPolicy = {
  accountId: string;
  policyId: string;
};

export const accountPolicySchema = new mongoose.Schema<AccountPolicy>(
  {
    accountId: { type: String, required: true, index: true },
    policyId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
accountPolicySchema.add(baseEntitySchema);
accountPolicySchema.index({ accountId: 1, policyId: 1 }, { unique: true });

export type AccountPolicySchema = typeof accountPolicySchema;
export type AccountPolicyEntity = HydratedDocument<InferSchemaType<typeof accountPolicySchema>>;
export type AccountPolicyCreate = InferSchemaType<AccountPolicySchema>;
