// schema do core para realms
import {
  BaseDocument,
  baseDocumentSchema,
} from '@/domains/commons/base/base.model';
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
  isActive: { type: Boolean, default: true },
});

schema.add(baseDocumentSchema);

export type AccountSchema = InferSchemaType<typeof schema>;
export type Account = mongoose.Document & AccountSchema & BaseDocument;
export type AccountDocument = Account;
export type AccountCreate = Omit<AccountSchema, never> & {
  // Todos os campos são obrigatórios para Account
};
export type AccountUpdate = Omit<AccountSchema, never> & {
  // Todos os campos são obrigatórios para Account
};

schema.index({ 'emails.email': 1 }, { unique: true, sparse: true });

schema.pre('save', async function () {
  try {
    if ((this.isNew || this.isModified('password')) && this.password) {
      this.salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, this.salt);
    }
  } catch (error) {
    // Usa if/else em vez de ternário para melhor cobertura de código
    // Cada branch fica em linha separada para análise de cobertura
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Unknown error during password hashing');
    }
  }
});

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<Account>(schemaName, schema);
};
