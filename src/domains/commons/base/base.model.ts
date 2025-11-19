import { InferSchemaType, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { updatedAtMiddleware } from './baseDocumentSchema.util';

export const baseDocumentIDSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
});

export const baseDocumentSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
baseDocumentSchema.add(baseDocumentIDSchema);

baseDocumentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

baseDocumentSchema.pre(['updateOne', 'findOneAndUpdate'], updatedAtMiddleware);

export type BaseDocumentID = InferSchemaType<typeof baseDocumentIDSchema>;

export type BaseDocument = InferSchemaType<typeof baseDocumentSchema> &
  BaseDocumentID;
