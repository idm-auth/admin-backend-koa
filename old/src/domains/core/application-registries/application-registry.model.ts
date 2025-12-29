import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { getCoreDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'application-registries';

export const schema = new mongoose.Schema({
  applicationKey: { type: String, required: true, unique: true },
  tenantId: { type: String, required: true, index: true },
  applicationId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type ApplicationRegistrySchema = InferSchemaType<typeof schema>;
export type ApplicationRegistry = ApplicationRegistrySchema & BaseDocument;
export type ApplicationRegistryCreate = Omit<
  ApplicationRegistrySchema,
  'applicationKey'
>;

export const getModel = () => {
  const conn = getCoreDb();
  return conn.model<ApplicationRegistry>(schemaName, schema);
};
