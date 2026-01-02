import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type AccountRole = {
  accountId: string;
  roleId: string;
};

export const accountRoleSchema = new mongoose.Schema<AccountRole>(
  {
    accountId: { type: String, required: true, index: true },
    roleId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
accountRoleSchema.add(baseEntitySchema);
accountRoleSchema.index({ accountId: 1, roleId: 1 }, { unique: true });

export type AccountRoleSchema = typeof accountRoleSchema;
export type AccountRoleEntity = HydratedDocument<InferSchemaType<typeof accountRoleSchema>>;
export type AccountRoleCreate = InferSchemaType<AccountRoleSchema>;
