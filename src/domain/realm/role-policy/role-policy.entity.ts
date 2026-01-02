import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type RolePolicy = {
  roleId: string;
  policyId: string;
};

export const rolePolicySchema = new mongoose.Schema<RolePolicy>(
  {
    roleId: { type: String, required: true, index: true },
    policyId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
rolePolicySchema.add(baseEntitySchema);
rolePolicySchema.index({ roleId: 1, policyId: 1 }, { unique: true });

export type RolePolicySchema = typeof rolePolicySchema;
export type RolePolicyEntity = HydratedDocument<InferSchemaType<typeof rolePolicySchema>>;

export type RolePolicyCreate = InferSchemaType<typeof rolePolicySchema>;
