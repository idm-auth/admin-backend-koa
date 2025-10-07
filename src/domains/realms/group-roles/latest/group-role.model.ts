import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'groupRoles';

export const schema = new mongoose.Schema({
  groupId: { type: String, required: true },
  roleId: { type: String, required: true },
});

schema.add(baseDocumentSchema);

export type GroupRole = InferSchemaType<typeof schema>;
export type GroupRoleDocument = InferSchemaType<typeof schema> & BaseDocument;
export type GroupRoleDocumentID = InferSchemaType<typeof schema> &
  BaseDocumentID;

schema.index({ groupId: 1, roleId: 1 }, { unique: true });
schema.index({ groupId: 1 });
schema.index({ roleId: 1 });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<GroupRoleDocument>(schemaName, schema);
};
