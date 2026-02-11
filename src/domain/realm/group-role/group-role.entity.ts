import { baseEntitySchema } from '@idm-auth/koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type GroupRole = {
  groupId: string;
  roleId: string;
};

export const groupRoleSchema = new mongoose.Schema<GroupRole>(
  {
    groupId: { type: String, required: true, index: true },
    roleId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);
groupRoleSchema.add(baseEntitySchema);
groupRoleSchema.index({ groupId: 1, roleId: 1 }, { unique: true });

export type GroupRoleSchema = typeof groupRoleSchema;
export type GroupRoleEntity = HydratedDocument<
  InferSchemaType<typeof groupRoleSchema>
>;

export type GroupRoleCreate = InferSchemaType<typeof groupRoleSchema>;
