import { getCoreDb } from '@/plugins/mongo.plugin';
import { InferSchemaType, Schema } from 'mongoose';
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

// model em cima do core DB
export const WebAdminConfigModel = async () => {
  const conn = await getCoreDb();
  return conn.model('WebAdminConfig', WebAdminConfigSchema);
};
