import { InferSchemaType, Schema } from 'mongoose';
import { baseSchema } from '@/models/base/base.v1.model';

export const baseConfigSchema = new Schema({
  app: { type: String, required: true, unique: true },
  env: { type: String, required: true },
});

baseConfigSchema.add(baseSchema);

export type BaseConfig = InferSchemaType<typeof baseConfigSchema>;
