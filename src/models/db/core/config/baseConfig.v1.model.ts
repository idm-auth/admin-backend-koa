import { Schema } from 'mongoose';
import { BaseSchema } from '@/models/base/base.v1.model';

export const BaseConfigSchema = new Schema({
  ...BaseSchema.obj,
  name: { type: String, required: true, unique: true },
  env: { type: String, required: true },
});
