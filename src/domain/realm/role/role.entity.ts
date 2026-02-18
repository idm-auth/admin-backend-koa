import { baseEntitySchema } from '@idm-auth/koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type Role = {
  name: string;
  description?: string;
  permissions: string[];
};

export const roleSchema = new mongoose.Schema<Role>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);
roleSchema.add(baseEntitySchema);

export type RoleSchema = typeof roleSchema;
export type RoleEntity = HydratedDocument<InferSchemaType<typeof roleSchema>>;

export type RoleCreate = InferSchemaType<typeof roleSchema>;
