import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const baseSchema = new Schema<BaseDocument>({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null },
});

baseSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

baseSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

baseSchema.methods.softDelete = async function (): Promise<void> {
  this.deletedAt = new Date();
};
