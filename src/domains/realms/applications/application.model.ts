import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import { randomBytes } from 'crypto';
import mongoose, { InferSchemaType } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const schemaName = 'applications';

/**
 * Application Schema
 *
 * Represents a system/application registered in the IAM.
 * Each application defines its availableActions which are used to:
 * 1. Document what actions the application supports
 * 2. Help users construct GRN patterns when creating policies
 *
 * availableActions.pathPattern:
 *   - Full URL pattern of the route (e.g., /api/realm/:tenantId/accounts/:id)
 *   - Used to help construct GRN resource-path in policies
 *   - Example: pathPattern /api/realm/:tenantId/accounts/:id
 *              → GRN: grn:global:iam-system::tenant-123:accounts/acc-456
 */
export const schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, index: true },
  systemId: { type: String, required: true, index: true },
  availableActions: [
    {
      resourceType: { type: String, required: true },
      pathPattern: { type: String, required: true },
      operations: { type: [String], required: true },
    },
  ],
  applicationSecret: {
    type: String,
    required: true,
    default: () => randomBytes(32).toString('base64'),
  },
  isActive: { type: Boolean, default: true },
});

schema.add(baseDocumentSchema);

schema.index({ systemId: 1 }, { unique: true });
schema.index({ 'availableActions.resourceType': 1 });
schema.index({ 'availableActions.pathPattern': 1 });

export type ApplicationSchema = InferSchemaType<typeof schema>;
export type Application = mongoose.Document & ApplicationSchema & BaseDocument;
export type ApplicationDocument = Application;
export type ApplicationCreate = Omit<ApplicationSchema, 'applicationSecret'>;
export type ApplicationUpdate = Partial<
  Omit<ApplicationSchema, 'applicationSecret'>
>;

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Application>(schemaName, schema);
};
