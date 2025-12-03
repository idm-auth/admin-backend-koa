import { InferSchemaType, Schema } from 'mongoose';
import { baseDocumentSchema } from '@/domains/commons/base/base.model';

export const baseConfigSchema = new Schema({
  app: { type: String, required: true, index: true },
  env: { type: String, required: true },
});

baseConfigSchema.index({ app: 1, env: 1 }, { unique: true });

baseConfigSchema.add(baseDocumentSchema);

export type BaseConfig = InferSchemaType<typeof baseConfigSchema>;
