import { InferSchemaType, model, Schema } from 'mongoose';
import { BaseConfigSchema } from './baseConfig.v1.model';

export const WebAdminConfigSchema = new Schema({
  ...BaseConfigSchema.obj,
  api: {
    main: {
      url: { type: String, required: true },
    },
  },
});

export type WebAdminConfig = InferSchemaType<typeof WebAdminConfigSchema>;

export const WebAdminConfigModel = model(
  'WebAdminConfig',
  WebAdminConfigSchema
);
