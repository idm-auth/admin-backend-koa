// schema do core para realms
import { BaseDocument, baseSchema } from '@/models/base/base.v1.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import bcrypt from 'bcrypt';
import mongoose, { InferSchemaType, Model } from 'mongoose';

const schemaName = 'users';

interface UserDocument extends BaseDocument {
  emails: { email: string; isPrimary: boolean }[];
  password: string;
  salt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  softDelete(): Promise<void>;
}

export const schema = new mongoose.Schema<UserDocument>({
  emails: [
    {
      email: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
    },
  ],
  password: { type: String, required: true },
  salt: { type: String, required: true },
});

schema.add(baseSchema);

schema.index({ 'emails.email': 1 }, { unique: true, sparse: true });

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, this.salt);
  next();
});

schema.pre('save', async function (next) {
  if (this.isModified('emails')) {
    const Model = this.constructor as Model<UserDocument>;
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

schema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

schema.methods.softDelete = async function (): Promise<void> {
  this.emails = [];
  this.password = null;
  this.salt = null;
  await baseSchema.methods.softDelete.call(this);
  await this.save();
};

export type User = InferSchemaType<typeof schema>;

export const getModel = (dbName: DBName) => {
  const conn = getRealmDb(dbName);
  return conn.model<UserDocument>(schemaName, schema);
};
