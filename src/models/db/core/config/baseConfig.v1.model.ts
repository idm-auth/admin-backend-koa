import { InferSchemaType, Schema } from 'mongoose';
import { BaseSchema } from '@/models/base/base.v1.model';

export const BaseConfigSchema = new Schema({
  ...BaseSchema.obj,
  app: { type: String, required: true, unique: true },
  env: { type: String, required: true },
});

export type BaseConfig = InferSchemaType<typeof BaseConfigSchema>;
