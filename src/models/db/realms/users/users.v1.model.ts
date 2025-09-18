// schema do core para realms
import { BaseDocument, baseSchema } from '@/models/base/base.v1.model';
import { DBName, getRealmDb } from '@/plugins/mongo.plugin';
import bcrypt from 'bcrypt';
import mongoose, { InferSchemaType } from 'mongoose';

const schemaName = 'users';

interface UserDocument extends BaseDocument {
  email: string;
  password: string;
  salt: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  softDelete(): Promise<void>;
}

export const schema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});

schema.add(baseSchema);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, this.salt);
  next();
});

schema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

schema.methods.softDelete = async function (): Promise<void> {
  this.email = null;
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
