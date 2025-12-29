import { baseEntitySchema } from 'koa-inversify-framework/common';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type Group = {
  name: string;
  description?: string;
};

export const groupSchema = new mongoose.Schema<Group>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);
groupSchema.add(baseEntitySchema);

export type GroupSchema = typeof groupSchema;
export type GroupEntity = HydratedDocument<InferSchemaType<typeof groupSchema>>;
