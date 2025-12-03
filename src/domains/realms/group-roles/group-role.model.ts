import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'group-roles';

export const schema = new mongoose.Schema({
  groupId: { type: String, required: true, index: true },
  roleId: { type: String, required: true, index: true },
});

schema.add(baseDocumentSchema);

export type GroupRoleSchema = InferSchemaType<typeof schema>;
export type GroupRole = GroupRoleSchema & BaseDocument;
export type GroupRoleDocument = GroupRoleSchema & BaseDocument;
export type GroupRoleDocumentID = GroupRoleSchema & BaseDocumentID;
export type GroupRoleCreate = Omit<GroupRoleSchema, never> & {
  // Todos os campos são obrigatórios para GroupRole
};

schema.index({ groupId: 1, roleId: 1 }, { unique: true });

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<GroupRoleDocument>(schemaName, schema);
};
