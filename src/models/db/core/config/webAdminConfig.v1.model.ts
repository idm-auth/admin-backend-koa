import { getCoreDb } from '@/plugins/mongo.plugin';
import { InferSchemaType, Schema } from 'mongoose';
import { baseConfigSchema, BaseConfig } from './baseConfig.v1.model';

interface IWebAdminConfig extends BaseConfig {
  api: {
    main: {
      url: string;
    };
  };
  coreRealm: {
    publicUUID: string;
  };
}

const schemaName = 'configs';
export const schema = new Schema<IWebAdminConfig>({
  api: {
    main: {
      url: { type: String, required: true },
    },
  },
  coreRealm: {
    publicUUID: { type: String, required: true },
  },
});

schema.add(baseConfigSchema);

export type WebAdminConfig = InferSchemaType<typeof schema>;

export const getModel = () => {
  const conn = getCoreDb();
  return conn.model(schemaName, schema);
};
