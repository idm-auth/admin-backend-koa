import { InferSchemaType, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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

baseDocumentSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  const update = this.getUpdate();
  if (update && typeof update === 'object' && !Array.isArray(update)) {
    (update as Record<string, unknown>).updatedAt = new Date();
  }
  next();
});

// Virtual getter para mapear .id para ._id
baseDocumentSchema.virtual('id').get(function () {
  return this._id;
});

export type BaseDocumentID = InferSchemaType<typeof baseDocumentIDSchema>;

export type BaseDocument = InferSchemaType<typeof baseDocumentSchema> &
  BaseDocumentID;
