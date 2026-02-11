import { baseEntitySchema } from '@idm-auth/koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type AccountGroup = {
  accountId: string;
  groupId: string;
};

export const accountGroupSchema = new mongoose.Schema<AccountGroup>(
  {
    accountId: { type: String, required: true, index: true },
    groupId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
accountGroupSchema.add(baseEntitySchema);
accountGroupSchema.index({ accountId: 1, groupId: 1 }, { unique: true });

export type AccountGroupSchema = typeof accountGroupSchema;
export type AccountGroupEntity = HydratedDocument<
  InferSchemaType<typeof accountGroupSchema>
>;
export type AccountGroupCreate = InferSchemaType<AccountGroupSchema>;
