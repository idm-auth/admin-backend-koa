// schema do core para realms
import { baseSchema } from '@/models/base/base.v1.model';
import { getCoreDb } from '@/plugins/mongo.plugin';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const schemaName = 'realms';
export const schema = new mongoose.Schema({
  publicUUID: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4(),
  },
  dbName: { type: String, required: true },
});
schema.add(baseSchema);
// model em cima do core DB
export const getModel = () => {
  const conn = getCoreDb();
  return conn.model(schemaName, schema);
};
