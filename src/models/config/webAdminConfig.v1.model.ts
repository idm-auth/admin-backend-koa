import { model, Schema } from 'mongoose';
import { BaseConfigSchema } from '../base/baseConfig.v1.model';

export const WebAdminConfigSchema = new Schema({
  ...BaseConfigSchema.obj,
  api: {
    main: {
      url: { type: String, required: true },
    },
  },
});

export const WebAdminConfigModel = model(
  'WebAdminConfig',
  WebAdminConfigSchema
);
