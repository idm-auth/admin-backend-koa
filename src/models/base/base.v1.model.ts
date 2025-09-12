import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface BaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export const BaseSchema = new Schema<BaseDocument>(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);
