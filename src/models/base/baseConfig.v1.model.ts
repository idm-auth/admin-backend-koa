import { Schema } from 'mongoose';
import { BaseSchema } from './base.v1.model';

export const BaseConfigSchema = new Schema({
  ...BaseSchema.obj,
  name: { type: String, required: true },
  env: { type: String, required: true },
});
