// schema do core para realms
import {
  BaseDocument,
  BaseDocumentID,
  baseDocumentSchema,
} from '@/models/base/base.v1.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import bcrypt from 'bcrypt';
import mongoose, { InferSchemaType, Model } from 'mongoose';

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
  if (this.isNew || this.isModified('password')) {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
  }
  next();
});

schema.pre('save', async function (next) {
  if (this.isModified('emails')) {
    const Model = this.constructor as Model<AccountDocument>;
    const primaryCount = this.emails.filter((e) => e.isPrimary).length;
    if (primaryCount > 1) {
      throw new Error('Only one primary email allowed');
    }
    for (const emailObj of this.emails) {
      const existing = await Model.findOne({
        'emails.email': emailObj.email,
        _id: { $ne: this._id },
      });
      if (existing) {
        throw new Error(`Email ${emailObj.email} already exists`);
      }
    }
  }
  next();
});

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<AccountDocument>(schemaName, schema);
};
