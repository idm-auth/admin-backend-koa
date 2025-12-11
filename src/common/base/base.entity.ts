import { InferSchemaType, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { updatedAtMiddleware } from './baseEntitySchema.util';

export const baseEntityIDSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
});

export const baseEntitySchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
baseEntitySchema.add(baseEntityIDSchema);

baseEntitySchema.pre('save', async function () {
  this.updatedAt = new Date();
});

baseEntitySchema.pre(['updateOne', 'findOneAndUpdate'], updatedAtMiddleware);

export type BaseEntityID = InferSchemaType<typeof baseEntityIDSchema>;

export type BaseEntity = InferSchemaType<typeof baseEntitySchema> &
  BaseEntityID;
