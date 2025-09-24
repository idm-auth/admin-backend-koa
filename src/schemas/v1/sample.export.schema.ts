// V1 version - re-export all and override specific ones
export * from '@/schemas/latest/sample.export.schema';
import { D as DLatest } from '@/schemas/latest/sample.export.schema';

// Sobrescrever B completamente
export const B = () => 'B v1 override';

// Sobrescrever D mas chamar o original
export const D = () => {
  const result = DLatest();
  return result + ' + D v1 extension';
};
