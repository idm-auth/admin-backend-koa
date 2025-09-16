// schema do core para realms
import { getCoreDb } from '@/plugins/mongo.plugin';
import mongoose from 'mongoose';

export const RealmSchema = new mongoose.Schema({
  publicUUID: { type: String, required: true, unique: true },
  dbName: { type: String, required: true },
});

// model em cima do core DB
export const RealmModel = async () => {
  const conn = await getCoreDb();
  return conn.model('Realms', RealmSchema);
};
