import { InferSchemaType, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// export interface BaseDocument extends Document {
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
// }
export const baseDocumentIDSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
});

export const baseDocumentSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deletedAt: { type: Date },
});
baseDocumentSchema.add(baseDocumentIDSchema);

baseDocumentSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

baseDocumentSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

baseDocumentSchema.methods.softDelete = async function (): Promise<void> {
  this.deletedAt = new Date();
};
export type BaseDocumentID = InferSchemaType<typeof baseDocumentIDSchema>;

export type BaseDocument = InferSchemaType<typeof baseDocumentSchema> &
  BaseDocumentID;
