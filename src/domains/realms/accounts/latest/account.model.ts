// schema do core para realms
import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/domains/commons/base/latest/base.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';

import bcrypt from 'bcrypt';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'accounts';

export const schema = new mongoose.Schema({
  emails: [
    {
      email: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
    },
  ],
  password: { type: String, required: true },
  salt: { type: String },
});

schema.add(baseDocumentSchema);

export type Account = InferSchemaType<typeof schema>;
export type AccountDocument = InferSchemaType<typeof schema> & BaseDocument;
export type AccountDocumentID = InferSchemaType<typeof schema> & BaseDocumentID;

schema.index({ 'emails.email': 1 }, { unique: true, sparse: true });

schema.pre('save', async function (next) {
  try {
    if ((this.isNew || this.isModified('password')) && this.password) {
      this.salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, this.salt);
    }
    next();
  } catch (error) {
    next(
      error instanceof Error
        ? error
        : new Error('Unknown error during password hashing')
    );
  }
});

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountDocument>(schemaName, schema);
};
