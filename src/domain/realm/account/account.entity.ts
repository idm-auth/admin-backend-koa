import { baseEntitySchema } from 'koa-inversify-framework/common';
import bcrypt from 'bcrypt';
import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

export type Account = {
  isActive: boolean;
  emails: Array<{
    email: string;
    isPrimary: boolean;
  }>;
  password: string;
  salt: string;
};

export const accountSchema = new mongoose.Schema<Account>(
  {
    emails: [
      {
        email: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    password: { type: String, required: true },
    salt: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
accountSchema.add(baseEntitySchema);

accountSchema.index({ 'emails.email': 1 }, { unique: true, sparse: true });

accountSchema.pre('save', async function () {
  if ((this.isNew || this.isModified('password')) && this.password) {
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
  }
});

export type AccountSchema = typeof accountSchema;
export type AccountEntity = HydratedDocument<InferSchemaType<typeof accountSchema>>;
