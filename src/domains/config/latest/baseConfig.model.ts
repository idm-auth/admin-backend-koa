import { InferSchemaType, Schema } from 'mongoose';
import { baseDocumentSchema } from '@/domains/commons/base/latest/base.model';

export const baseConfigSchema = new Schema({
  app: { type: String, required: true, unique: true },
  env: { type: String, required: true },
});

baseConfigSchema.add(baseDocumentSchema);

export type BaseConfig = InferSchemaType<typeof baseConfigSchema>;
