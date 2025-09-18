import { InferSchemaType, Schema } from 'mongoose';
import { BaseSchema } from '@/models/base/base.v1.model';

export const BaseConfigSchema = new Schema({
  app: { type: String, required: true, unique: true },
  env: { type: String, required: true },
});

BaseConfigSchema.add(BaseSchema);

export type BaseConfig = InferSchemaType<typeof BaseConfigSchema>;
